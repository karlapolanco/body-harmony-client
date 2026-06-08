'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mjgkznehdzpiwwqdojaz.supabase.co',
  'sb_publishable_2M4eaPemRhZqe73PZC9NOw_xpGRDKui'
)

export default function EjercicioDetalle() {
  const { id } = useParams()
  const router = useRouter()
  const [ejercicio, setEjercicio] = useState<any>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from('ejercicios')
        .select('*')
        .eq('id', id)
        .single()
      setEjercicio(data)
      setCargando(false)
    }
    if (id) cargar()
  }, [id])

  if (cargando) return (
    <div style={{ minHeight: '100vh', background: '#FAF0E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#3D2B1F' }}>Cargando...</p>
    </div>
  )

  if (!ejercicio) return (
    <div style={{ minHeight: '100vh', background: '#FAF0E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#3D2B1F' }}>Ejercicio no encontrado.</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#FAF0E6', padding: '24px' }}>
      <button
        onClick={() => router.back()}
        style={{ background: 'none', border: 'none', color: '#C9A96E', fontSize: '15px', cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        ← Volver
      </button>

      <div style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #E8D9CC' }}>
        <h1 style={{ color: '#3D2B1F', fontSize: '22px', marginBottom: '8px' }}>{ejercicio.nombre}</h1>
        <p style={{ color: '#A08060', fontSize: '13px', marginBottom: '16px' }}>{ejercicio.categoria}</p>

        {ejercicio.imagen_url && (
          <img
            src={ejercicio.imagen_url}
            alt={ejercicio.nombre}
            style={{ width: '100%', borderRadius: '12px', marginBottom: '16px' }}
          />
        )}

        {ejercicio.descripcion && (
          <p style={{ color: '#3D2B1F', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>
            {ejercicio.descripcion}
          </p>
        )}

        {ejercicio.descanso && (
          <div style={{ background: '#FAF0E6', borderRadius: '10px', padding: '12px 16px', marginTop: '8px' }}>
            <span style={{ color: '#A08060', fontSize: '13px' }}>⏱ Descanso: </span>
            <span style={{ color: '#3D2B1F', fontWeight: 600 }}>{ejercicio.descanso}</span>
          </div>
        )}
      </div>
    </div>
  )
}
