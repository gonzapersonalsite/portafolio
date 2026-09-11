import { describe, it, expect } from 'vitest'
import data from './data.json'

describe('contenido estático de idiomas', () => {
    it('tiene al menos un idioma', () => {
        expect(data.length).toBeGreaterThan(0)
    })

    it('cumple el contrato de campos', () => {
        for (const lang of data) {
            expect(lang.nameEn.length).toBeGreaterThan(0)
            expect(lang.levelEn.length).toBeGreaterThan(0)
            expect(lang.proficiency).toBeGreaterThanOrEqual(0)
            expect(lang.proficiency).toBeLessThanOrEqual(100)
            expect(typeof lang.order).toBe('number')
        }
    })

    it('está ordenado por order ascendente', () => {
        const orders = data.map((l) => l.order)
        expect(orders).toEqual([...orders].sort((a, b) => a - b))
    })
})
