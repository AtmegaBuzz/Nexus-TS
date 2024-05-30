import { sha256 } from 'multiformats/hashes/sha2'
import { CID } from 'multiformats/cid'

export async function generateCID(inputString: string): Promise<string> {
    
    const bytes = new TextEncoder().encode(inputString)
    const hash = await sha256.digest(bytes)

    const cid = CID.create(1, 0x55, hash)
    
    return cid.toString()
}

export async function hash(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
  
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
    return hashHex;
  }