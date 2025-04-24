import React, { useState } from 'react';
import { PlusIcon, DocumentIcon, XMarkIcon, FolderIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ChatDrawer from './ChatDrawer';
import { createProject } from '../apis/index.apis';
import { handleApiError } from '../utils/errorHandler';

interface Project {
  id: string;
  name: string;
  fileCount: number;
  files: File[];
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => 
        file.type === 'application/pdf' || file.type === 'text/plain'
      );
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append('project_id', projectName);
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      await createProject(formData);
      
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectName,
        fileCount: selectedFiles.length,
        files: selectedFiles
      };

      setProjects([...projects, newProject]);
      setProjectName('');
      setSelectedFiles([]);
      setIsModalOpen(false);
      toast.success('Project created successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
      handleApiError(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleModalClose = () => {
    setProjectName('');
    setSelectedFiles([]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Projects Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Create Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 bg-gray-800 rounded-lg border border-gray-700">
              <FolderIcon className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-200 mb-2">No Projects Yet</h3>
              <p className="text-gray-400 text-center max-w-md">
                Get started by creating your first project. Upload PDF or TXT files to begin analyzing your documents.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Create Your First Project
              </button>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-700 hover:border-indigo-500 group cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                    <FolderIcon className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 group-hover:text-indigo-400 transition-colors">
                    {project.name}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <DocumentIcon className="h-5 w-5" />
                  <p>{project.fileCount} {project.fileCount === 1 ? 'file' : 'files'}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-700/50 rounded-full">
                    Created {new Date(parseInt(project.id)).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Project Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50" 
              onClick={handleModalClose}
              style={{
                opacity: isModalOpen ? 1 : 0,
                transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
            
            <div 
              className="fixed inset-y-0 right-0 flex max-w-full"
              style={{
                transform: isModalOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="w-screen max-w-md">
                <div 
                  className="flex h-full flex-col bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700"
                  style={{
                    transform: isModalOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-100">Create New Project</h2>
                    <button
                      onClick={handleModalClose}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="projectName">
                        Project Name
                      </label>
                      <input
                        type="text"
                        id="projectName"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-gray-300 text-sm font-bold mb-2">
                        Upload Files (PDF/TXT)
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <DocumentIcon className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="mb-2 text-sm text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-400">PDF or TXT files</p>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.txt"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      
                      {/* Selected Files List */}
                      {selectedFiles.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-400 mb-2">Selected files:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                              >
                                <DocumentIcon className="h-4 w-4 text-gray-400" />
                                <span className="max-w-[200px] truncate">{file.name}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                  }}
                                  className="text-gray-400 hover:text-gray-200"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        type="button"
                        onClick={handleModalClose}
                        className="px-4 py-2 text-gray-400 hover:text-gray-200"
                        disabled={isCreating}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isCreating}
                      >
                        {isCreating ? (
                          <>
                            <ArrowPathIcon className="h-5 w-5 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedProject && (
        <ChatDrawer
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          projectName={selectedProject.name}
        />
      )}
    </div>
  );
};

export default Projects; 