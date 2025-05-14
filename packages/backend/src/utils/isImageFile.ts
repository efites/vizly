import fs from 'fs/promises'
import sharp from 'sharp'



export const isImageFile = async (filePath: string): Promise<boolean> => {
	try {
		const stats = await fs.stat(filePath)
		if (!stats.isFile()) return false

		const buffer = await fs.readFile(filePath)
		const metadata = await sharp(buffer).metadata()
		return !!metadata.format
	} catch {
		return false
	}
}
