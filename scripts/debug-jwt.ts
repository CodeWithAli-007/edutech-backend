import 'dotenv/config';
import { verifyJwt } from '../src/utils/jwt';

const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZDZmYTFmOS05NjQ4LTQwMGUtYWY3My0zYzEyOGU1Nzk5YzIiLCJpYXQiOjE3NTg4MzE2MDIsImV4cCI6MTc1ODgzMjUwMn0.GkCpxFxq3OWXG4bsw6GjWUllrOfXn8AWleC2b-j8muoDE_kM5Ce_YPkXiuOybMo_7b7dNNEbIRLkTujyVWZmxn01C1QTInPa4oTG__x2sLWOFXkXVOFTGUtUPJZvt1FarFggJZicoMEblfsiKHGmVRPKnj2omTWzHPlOOW7G4tHELD3KFSsV5_3B80fXK1kfdp0wr9jZmVYRnpcnwraaOw9b4EPuWA9-Po0LzsolDaV2BIR1YZaYsFsQD69KzIBGcVtGstGUky13ZxvAVwOITbPTfns6TXty4VYdJkQGTO_HNQsRp-QrEI_xGpL9QcIJVPsHFSrkt0vz_aC-omG6ag';

async function debugJWT() {
  try {
    const decoded = verifyJwt<{ sub: string }>(token, 'accessTokenPublicKey');
    console.log('Decoded JWT:', decoded);
    
    if (decoded) {
      console.log('User ID from JWT:', decoded.sub);
    }
  } catch (error) {
    console.error('JWT verification error:', error);
  }
}

debugJWT();


