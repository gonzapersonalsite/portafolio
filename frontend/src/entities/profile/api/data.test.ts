import { describe, it, expect } from 'vitest'
import data from './data.json'

const publicImages = new Set(Object.keys(import.meta.glob('/public/images/**/*')))

describe('static profile content', () => {
    it('the image is local and exists in public/', () => {
        expect(data.imageUrl.startsWith('/images/'), `external image: ${data.imageUrl}`).toBe(true)
        expect(publicImages.has(`/public${data.imageUrl}`), `missing on disk: ${data.imageUrl}`).toBe(true)
    })

    it('satisfies the essential field contract', () => {
        expect(data.id).toBe('profile')
        expect(data.email).toContain('@')
        expect(data.fullNameEn.length).toBeGreaterThan(0)
        expect(data.fullNameEs.length).toBeGreaterThan(0)
        expect(data.cvUrl.length).toBeGreaterThan(0)
        expect(data.githubUrl.length).toBeGreaterThan(0)
        expect(data.logoText.length).toBeGreaterThan(0)
    })
})
