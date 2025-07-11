import axios from "axios"
import { backendUrl } from "../App"
import {useState,useEffect} from "react"

export default function List(){
    const [list,setList]=useState([])
    
    const fetchList=async()=>{
        try{
          const response=await axios.get(backendUrl+'/api/product/list')
          console.log(response.data)
        } catch(error){

        }
    }

    useEffect(()=>{
        fetchList()
    },[])

    return(
        <div>

        </div>
    )
}