'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mjgkznehdzpiwwqdojaz.supabase.co',
  'sb_publishable_2M4eaPemRhZqe73PZC9NOw_xpGRDKui'
)

const DIAS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']

const COLORES: Record<string, string> = {
  'Tren inferior': '#A0845C',
  'Tren superior': '#7A9E7E',
  'HIIT': '#D4734A',
  'Core': '#6A9E7A',
  'Full body': '#7A9EBE',
  'Descanso activo': '#B07EB0',
  'Cardio': '#C9A96E',
}

export default function Dashboard() {
  const router = useRouter()
  const [perfil, setPerfil] = useState<any>(null)
  const [rutina, setRutina] = useState<any[]>([])
  const [ejercicios, setEjercicios] = useState<any[]>([])
  const [diaSeleccionado, setDiaSeleccionado] = useState('Lunes')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }

      const { data: p } = await supabase.from('perfiles').select('*').eq('id', user.id).single()
      setPerfil(p)

      const { data: r } = await supabase
        .from('rutina_semanal')
        .select('*')
        .eq('cliente_id', user.id)
      setRutina(r || [])

      const { data: e } = await supabase
        .from('cliente_ejercicios')
        .select('*, ejercicios(*)')
        .eq('cliente_id', user.id)
      setEjercicios(e || [])

      const hoy = new Date().toLocaleDateString('es-MX', { weekday: 'long' })
      setDiaSeleccionado(hoy.charAt(0).toUpperCase() + hoy.slice(1))

      setCargando(false)
    }
    cargar()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  function getTipo(dia: string) {
    return rutina.find(r => r.dia === dia)?.tipo || ''
  }

  function getEjerciciosDia(dia: string) {
    return ejercicios.filter(e => e.dia === dia)
  }

  if (cargando) return (
    <div style={{ minHeight: '100vh', background: '#FAF0E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#3D2B1F' }}>Cargando...</p>
    </div>
  )

  const tipoDia = getTipo(diaSeleccionado)
  const ejerciciosDia = getEjerciciosDia(diaSeleccionado)

  return (
    <div style={{ minHeight: '100vh', background: '#FAF0E6', padding: '24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: '#3D2B1F', fontSize: '22px', margin: 0 }}>Hola, 👋</h2>
            <p style={{ color: '#A08060', fontSize: '13px', margin: 0 }}>{perfil?.email}</p>
          </div>
          <button onClick={logout} style={{ background: 'none', border: '1px solid #C9A96E', color: '#C9A96E', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Salir</button>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #E8D9CC' }}>
          <h3 style={{ color: '#3D2B1F', fontSize: '16px', marginBottom: '16px', marginTop: 0 }}>📅 Tu rutina semanal</h3>
          {DIAS.map(dia => {
            const tipo = getTipo(dia)
            const seleccionado = dia === diaSeleccionado
            return (
              <div key={dia} onClick={() => setDiaSeleccionado(dia)}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', gap: '12px' }}>
                <span style={{ width: '90px', fontWeight: seleccionado ? 700 : 400, color: seleccionado ? '#3D2B1F' : '#A08060', fontSize: '14px' }}>
                  {dia}
                </span>
                <div style={{
                  flex: 1, borderRadius: '8px', padding: '10px 14px',
                  background: tipo ? (COLORES[tipo] || '#C9A96E') : '#F0E8DE',
                  color: tipo ? '#fff' : '#C9A96E', fontSize: '14px',
                  border: seleccionado ? '2px solid #3D2B1F' : '2px solid transparent',
                }}>
                  {tipo || '— Sin asignar —'}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #E8D9CC' }}>
          <h3 style={{ color: '#3D2B1F', fontSize: '16px', marginBottom: '16px', marginTop: 0 }}>
            💪 {diaSeleccionado} {tipoDia ? `· ${tipoDia}` : ''}
          </h3>
          {ejerciciosDia.length === 0 ? (
            <p style={{ color: '#A08060', fontSize: '14px' }}>Aún no tienes ejercicios asignados.</p>
          ) : (
            ejerciciosDia.map((e: any) => (
              <div key={e.id} onClick={() => router.push(`/ejercicio/${e.ejercicios?.id ?? e.id}`)}
                style={{ padding: '14px', borderRadius: '10px', border: '1px solid #E8D9CC', cursor: 'pointer', marginBottom: '10px' }}>
                <div style={{ fontWeight: 600, color: '#3D2B1F' }}>{e.ejercicios?.nombre}</div>
                <div style={{ color: '#A08060', fontSize: '13px' }}>{e.ejercicios?.categoria} · {e.series} series · {e.repeticiones} reps</div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
