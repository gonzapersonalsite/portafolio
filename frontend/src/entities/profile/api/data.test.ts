import { describe, it, expect } from 'vitest'
import data from './data.json'

const publicImages = new Set(Object.keys(import.meta.glob('/public/images/**/*')))

describe('contenido estático del perfil', () => {
    it('la imagen es local y existe en public/', () => {
        expect(data.imageUrl.startsWith('/images/'), `imagen externa: ${data.imageUrl}`).toBe(true)
        expect(publicImages.has(`/public${data.imageUrl}`), `no existe en disco: ${data.imageUrl}`).toBe(true)
    })

    it('cumple el contrato de campos esenciales', () => {
        expect(data.id).toBe('profile')
        expect(data.email).toContain('@')
        expect(data.fullNameEn.length).toBeGreaterThan(0)
        expect(data.fullNameEs.length).toBeGreaterThan(0)
        expect(data.cvUrl.length).toBeGreaterThan(0)
        expect(data.githubUrl.length).toBeGreaterThan(0)
        expect(data.logoText.length).toBeGreaterThan(0)
    })
})
