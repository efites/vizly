import fs from 'fs'


export const getFileColumns = (filePath: string) => {
	try {
		const content = fs.readFileSync(filePath, 'utf8')

		return content.split('\n')[0].split(',')
	} catch {
		return []
	}
}
