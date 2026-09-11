import { describe, it, expect } from 'vitest'
import data from './data.json'

const publicImages = new Set(Object.keys(import.meta.glob('/public/images/**/*')))

describe('contenido estático de proyectos', () => {
    it('tiene al menos un proyecto', () => {
        expect(data.length).toBeGreaterThan(0)
    })

    it('todas las imágenes son locales y existen en public/', () => {
        for (const project of data) {
            expect(project.imageUrls.length, `sin imágenes: ${project.id}`).toBeGreaterThan(0)
            for (const url of project.imageUrls) {
                expect(url.startsWith('/images/'), `imagen externa en ${project.id}: ${url}`).toBe(true)
                expect(publicImages.has(`/public${url}`), `no existe en disco: ${url}`).toBe(true)
            }
            if (project.imageUrlsFull) {
                expect(project.imageUrlsFull.length).toBe(project.imageUrls.length)
                for (const url of project.imageUrlsFull) {
                    expect(url.startsWith('/images/'), `imagen externa (full) en ${project.id}: ${url}`).toBe(true)
                    expect(publicImages.has(`/public${url}`), `no existe en disco: ${url}`).toBe(true)
                }
            }
        }
    })

    it('cumple el contrato de campos', () => {
        for (const project of data) {
            expect(typeof project.id).toBe('string')
            expect(project.titleEn.length).toBeGreaterThan(0)
            expect(project.titleEs.length).toBeGreaterThan(0)
            expect(project.descriptionEn.length).toBeGreaterThan(0)
            expect(project.descriptionEs.length).toBeGreaterThan(0)
            expect(project.technologies.length).toBeGreaterThan(0)
            expect(['WEB', 'DESKTOP', 'MOBILE', 'OTHER']).toContain(project.type)
            expect(typeof project.featured).toBe('boolean')
            expect(typeof project.order).toBe('number')
        }
    })

    it('está ordenado por order ascendente', () => {
        const orders = data.map((p) => p.order)
        const sorted = [...orders].sort((a, b) => a - b)
        expect(orders).toEqual(sorted)
    })

    it('no hay ids duplicados', () => {
        const ids = data.map((p) => p.id)
        expect(new Set(ids).size).toBe(ids.length)
    })
})
