// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { db } from '../../firebase';
export default async(req,res) => {
  const entries = await db.collection('mahasiswa').get();
  const data = entries.docs.map(entry => ({
    id: entry.id,
    ...entry.data()
  }));
  res.status(200).json({data})
}