import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CreateArtifactForm } from '../components/CreateArtifactForm'

const CreateArtifact: React.FC = () => {
  const navigate = useNavigate()

  const handleSuccess = (artifactId: string) => {
    // Navigate to showcase or profile page after successful creation
    navigate('/showcase', { 
      state: { message: 'Artifact published successfully!' } 
    })
  }

  const handleCancel = () => {
    navigate(-1) // Go back to previous page
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <CreateArtifactForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

export default CreateArtifact