import { describe, it, expect } from 'vitest'
import data from './data.json'

describe('contenido estático de skills', () => {
    it('tiene skills en varias categorías', () => {
        expect(data.length).toBeGreaterThan(0)
        expect(new Set(data.map((s) => s.category)).size).toBeGreaterThan(1)
    })

    it('cumple el contrato de campos', () => {
        for (const skill of data) {
            expect(skill.nameEn.length).toBeGreaterThan(0)
            expect(skill.nameEs.length).toBeGreaterThan(0)
            expect(skill.level).toBeGreaterThanOrEqual(0)
            expect(skill.level).toBeLessThanOrEqual(100)
            expect(skill.category.length).toBeGreaterThan(0)
            expect(typeof skill.order).toBe('number')
        }
    })

    it('está ordenado por order ascendente', () => {
        const orders = data.map((s) => s.order)
        expect(orders).toEqual([...orders].sort((a, b) => a - b))
    })
})
