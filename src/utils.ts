import { sha256 } from 'multiformats/hashes/sha2'
import { CID } from 'multiformats/cid'

export async function generateCID(inputString: string): Promise<string> {
    
    const bytes = new TextEncoder().encode(inputString)
    const hash = await sha256.digest(bytes)

    const cid = CID.create(1, 0x55, hash)
    
    return cid.toString()
}