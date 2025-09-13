import { createConnection } from "@/utils/db"

export default async function GET(req,res){
    try {
        const db = await createConnection();
        const query = "SELECT id, name, address,state,contact, city, image,email, creator_id FROM schools"
        const [result] = await db.query(query)
        return res.json({message:"data fetched successfully", result})
        
    } catch (error) {
        return res.json({message:error.message})
    }
}

