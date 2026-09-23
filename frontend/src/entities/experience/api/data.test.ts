import { describe, it, expect } from 'vitest'
import data from './data.json'

describe('static experience content', () => {
    it('has at least one experience', () => {
        expect(data.length).toBeGreaterThan(0)
    })

    it('satisfies the field contract and date format', () => {
        for (const exp of data) {
            expect(exp.companyEn.length).toBeGreaterThan(0)
            expect(exp.positionEn.length).toBeGreaterThan(0)
            expect(exp.descriptionEn.length).toBeGreaterThan(0)
            expect(exp.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
            if (exp.endDate) {
                expect(exp.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
            }
            expect(Array.isArray(exp.technologies)).toBe(true)
        }
    })

    it('is sorted like the API: endDate DESC NULLS FIRST, startDate DESC', () => {
        const keys = data.map((e) => ({ e: e.endDate ?? '9999-12-31', s: e.startDate }))
        const sorted = [...keys].sort((a, b) => (a.e !== b.e ? b.e.localeCompare(a.e) : b.s.localeCompare(a.s)))
        expect(keys).toEqual(sorted)
    })
})
