import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [family, setFamily] = useState(null)
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadFamily(session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadFamily(session.user.id)
      else { setFamily(null); setMember(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadFamily(userId) {
    try {
      const { data: memberData } = await supabase
        .from('family_members').select('*, families(*)').eq('user_id', userId).single()
      if (memberData) { setMember(memberData); setFamily(memberData.families) }
    } catch (err) { console.error('Error loading family:', err) }
    finally { setLoading(false) }
  }

  async function signUp(email, password) { return supabase.auth.signUp({ email, password }) }
  async function signIn(email, password) { return supabase.auth.signInWithPassword({ email, password }) }
  async function signOut() { await supabase.auth.signOut() }

  async function createFamily(familyName, memberName, emoji, role, groupType = 'family') {
    const { data: familyData, error: familyError } = await supabase
      .from('families').insert({ name: familyName, created_by: user.id, group_type: groupType }).select().single()
    if (familyError) throw familyError
    const { data: memberData, error: memberError } = await supabase
      .from('family_members').insert({ family_id: familyData.id, user_id: user.id, name: memberName, emoji, role, is_admin: true }).select().single()
    if (memberError) throw memberError
    setFamily(familyData); setMember(memberData)
    return { family: familyData, member: memberData }
  }

  async function refreshFamily() { if (user) await loadFamily(user.id) }

  return (
    <AuthContext.Provider value={{ user, family, member, loading, signUp, signIn, signOut, createFamily, refreshFamily }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
