import { describe, it, expect } from 'vitest'
import data from './data.json'

const publicImages = new Set(Object.keys(import.meta.glob('/public/images/**/*')))

describe('static project content', () => {
    it('has at least one project', () => {
        expect(data.length).toBeGreaterThan(0)
    })

    it('all images are local and exist in public/', () => {
        for (const project of data) {
            expect(project.imageUrls.length, `no images: ${project.id}`).toBeGreaterThan(0)
            for (const url of project.imageUrls) {
                expect(url.startsWith('/images/'), `external image in ${project.id}: ${url}`).toBe(true)
                expect(publicImages.has(`/public${url}`), `missing on disk: ${url}`).toBe(true)
            }
            if (project.imageUrlsFull) {
                expect(project.imageUrlsFull.length).toBe(project.imageUrls.length)
                for (const url of project.imageUrlsFull) {
                    expect(url.startsWith('/images/'), `external image (full) in ${project.id}: ${url}`).toBe(true)
                    expect(publicImages.has(`/public${url}`), `missing on disk: ${url}`).toBe(true)
                }
            }
        }
    })

    it('satisfies the field contract', () => {
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

    it('is sorted by ascending order', () => {
        const orders = data.map((p) => p.order)
        const sorted = [...orders].sort((a, b) => a - b)
        expect(orders).toEqual(sorted)
    })

    it('has no duplicate ids', () => {
        const ids = data.map((p) => p.id)
        expect(new Set(ids).size).toBe(ids.length)
    })
})
