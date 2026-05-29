'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const colores: any = {
  'Tren superior': '#C9A96E',
  'Tren inferior': '#A08060',
  'HIIT': '#e07b5a',
  'Core': '#7ba88c',
  'Full body': '#7a9ec0',
  'Descanso activo': '#b8a0c8',
  'Descanso': '#aaaaaa'
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [ejercicios, setEjercicios] = useState<any[]>([])
  const [rutina, setRutina] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/'); return }
      setUser(data.user)
      supabase.from('perfiles').select('*').eq('id', data.user.id).single().then(({ data: p }) => {
        if (p) setPerfil(p)
        // cargar ejercicios
        fetch(`https://body-harmony-admin.vercel.app/api/cliente-ejercicios?cliente_id=${data.user.id}`).then(r => r.json()).then(result => {
        })
        if (result.data) setEjercicios(result.data)
        // cargar rutina
        fetch(`https://body-harmony-admin.vercel.app/api/rutina-semanal?cliente_id=${data.user.id}`)
          .then(r => r.json()).then(result => { if (result.data) setRutina(result.data) })
      })
    })
  }, [])

  function getTipoDia(dia: string) {
    return rutina.find(r => r.dia === dia)?.tipo || ''
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div style={{ background: '#F5EDE4', minHeight: '100vh', padding: '24px', fontFamily: 'Georgia, serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ color: '#3D2B1F', fontSize: '22px', margin: 0 }}>Hola, {perfil?.nombre} 👋</h1>
            <p style={{ color: '#A08060', fontSize: '13px', margin: 0 }}>{user?.email}</p>
          </div>
          <button onClick={logout} style={{ background: 'none', border: '1px solid #C9A96E', color: '#C9A96E', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Salir</button>
        </div>

        {/* RUTINA SEMANAL */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid #E8D9CC' }}>
          <h2 style={{ color: '#3D2B1F', fontSize: '16px', marginBottom: '16px' }}>📅 Tu rutina semanal</h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {DIAS.map(dia => {
              const tipo = getTipoDia(dia)
              return (
                <div key={dia} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '90px', fontWeight: 600, color: '#3D2B1F', fontSize: '14px' }}>{dia}</div>
                  <div style={{ flex: 1, padding: '8px 14px', borderRadius: '8px', background: tipo ? colores[tipo] || '#E8D9CC' : '#F5EDE4', color: tipo ? '#fff' : '#aaa', fontSize: '14px', fontWeight: 500 }}>
                    {tipo || '— Sin asignar —'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* EJERCICIOS */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #E8D9CC' }}>
          <h2 style={{ color: '#3D2B1F', fontSize: '16px', marginBottom: '16px' }}>💪 Tus ejercicios</h2>
          {ejercicios.length === 0 ? (
            <p style={{ color: '#A08060', fontSize: '14px' }}>Aún no tienes ejercicios asignados.</p>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {ejercicios.map((a) => (
                <div key={a.id} style={{ padding: '14px', borderRadius: '10px', border: '1px solid #E8D9CC' }}>
                  <div style={{ fontWeight: 600, color: '#3D2B1F' }}>{a.ejercicios?.nombre}</div>
                  <div style={{ color: '#A08060', fontSize: '13px' }}>{a.ejercicios?.categoria} · {a.series} series · {a.repeticiones} reps</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
