import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI'
import axios from "axios"
import toast from "react-hot-toast"
import NoteCard from '../components/NoteCard'
import api from '../lib/axios'
import NotesNotFound from '../components/NotesNotFound'
import { FileSearchIcon, DatabaseIcon, PackageIcon } from "lucide-react";
import NotFound from "../components/NotFound";

const HomePage = () => {
  const [isRateLimited,setRateLimited] = useState(false)
  const [notes,setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const fetchNotes = async () => {
      try {
        const res = await api.get("/product")
        console.log(res.data)
        setNotes(res.data)
        setRateLimited(false)
      } catch (error) {
        console.log("Error fetching products")
        console.log(error)
        if (error.response.status === 429) {
          setRateLimited(true)
        } else {
          toast.error("failed to load products")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  },[])

  return (
    <div className="min-h-screen">
      <Navbar/>
      {isRateLimited && <RateLimitedUI/>}
      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading && <div className='text-center text-primary py-10'>Loading products...</div>}
        {notes.length === 0 && !isRateLimited && !loading &&
          <NotFound
  icon={FileSearchIcon}
  title="No schemas yet"
  description="Define your first schema to start structuring products in your system."
  link="/schemas/create"
  linkText="Create Schema"
/>
        
        }
        {notes.length > 0 && !isRateLimited && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} setNotes={setNotes} />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
