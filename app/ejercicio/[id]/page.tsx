
'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EjercicioDetalle() {
  const { id } = useParams()
  const router = useRouter()
  const [ejercicio, setEjercicio] = useState<any>(null)

  useEffect(() => {
    fetch(`https://body-harmony-admin.vercel.app/api/ejercicio-detalle?id=${id}`)
      .then(r => r.json())
      .then(result => { if (result.data) setEjercicio(result.data) })
  }, [id])

  if (!ejercicio) return <div style={{ padding: '24px', fontFamily: 'Georgia, serif' }}>Cargando...</div>

  return (
    <div style={{ background: '#F5EDE4', minHeight: '100vh', padding: '24px', fontFamily: 'Georgia, serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#A08060', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' }}>← Volver</button>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #E8D9CC' }}>
          <h1 style={{ color: '#3D2B1F', fontSize: '22px', marginBottom: '8px' }}>{ejercicio.nombre}</h1>
          <p style={{ color: '#A08060', fontSize: '13px', marginBottom: '16px' }}>{ejercicio.categoria}</p>
          {ejercicio.imagen_url && <img src={ejercicio.imagen_url} alt={ejercicio.nombre} style={{ width: '100%', borderRadius: '12px', marginBottom: '16px' }} />}
          {ejercicio.descripcion && <p style={{ color: '#3D2B1F', fontSize: '15px', lineHeight: '1.6' }}>{ejercicio.descripcion}</p>}
        </div>
      </div>
    </div>
  )
}
