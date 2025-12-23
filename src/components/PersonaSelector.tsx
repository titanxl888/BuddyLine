'use client';

import { useState } from 'react';
import { Persona } from '@/types';
import { personas as builtInPersonas } from '@/data/personas';

interface PersonaSelectorProps {
  personas: Persona[];
  currentPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
  onAddPersona?: (persona: Persona) => void;
  onDeletePersona?: (personaId: string) => void;
  onUpdatePersona?: (personaId: string, updates: Partial<Persona>) => void;
  hasMessages?: boolean;
}

export default function PersonaSelector({
  personas,
  currentPersona,
  onPersonaChange,
  onAddPersona,
  onDeletePersona,
  onUpdatePersona,
  hasMessages = false
}: PersonaSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPersonaId, setEditingPersonaId] = useState<string | null>(null);
  const [personaForm, setPersonaForm] = useState<{
    name: string;
    role: string;
    gender: 'Male' | 'Female' | 'Other';
    age: number;
    background: string;
    personality: string;
    interests: string[];
    communicationStyle: string;
    distinctiveTraits: string[];
    prompt: string;
  }>({
    name: '',
    role: '',
    gender: 'Other',
    age: 25,
    background: '',
    personality: '',
    interests: [],
    communicationStyle: '',
    distinctiveTraits: [],
    prompt: ''
  });

  const isBuiltIn = (persona: Persona) => builtInPersonas.some(p => p.id === persona.id);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingPersonaId(null);
    setPersonaForm({
      name: '',
      role: '',
      gender: 'Other',
      age: 25,
      background: '',
      personality: '',
      interests: [],
      communicationStyle: '',
      distinctiveTraits: [],
      prompt: ''
    });
    setShowModal(true);
  };

  const openEditModal = (persona: Persona) => {
    setIsEditing(true);
    setEditingPersonaId(persona.id);
    setPersonaForm({
      name: persona.name,
      role: persona.role,
      gender: persona.gender as 'Male' | 'Female' | 'Other',
      age: persona.age,
      background: persona.background,
      personality: persona.personality,
      interests: [...persona.interests],
      communicationStyle: persona.communicationStyle,
      distinctiveTraits: [...persona.distinctiveTraits],
      prompt: persona.prompt
    });
    setShowModal(true);
  };

  const handleSavePersona = () => {
    if (!personaForm.name.trim() || !personaForm.role.trim() || !personaForm.prompt.trim()) {
      alert('Please fill in name, role, and prompt');
      return;
    }

    if (isEditing && editingPersonaId) {
      // Update existing persona
      const updates = {
        ...personaForm,
        interests: personaForm.interests.filter(i => i.trim()),
        distinctiveTraits: personaForm.distinctiveTraits.filter(t => t.trim())
      };
      onUpdatePersona?.(editingPersonaId, updates);
    } else {
      // Create new persona
      const persona: Persona = {
        id: `custom-${Date.now()}`,
        ...personaForm,
        interests: personaForm.interests.filter(i => i.trim()),
        distinctiveTraits: personaForm.distinctiveTraits.filter(t => t.trim())
      };
      onAddPersona?.(persona);
    }

    setShowModal(false);
  };

  const addInterest = () => {
    setPersonaForm(prev => ({ ...prev, interests: [...prev.interests, ''] }));
  };

  const updateInterest = (index: number, value: string) => {
    setPersonaForm(prev => ({
      ...prev,
      interests: prev.interests.map((i, idx) => idx === index ? value : i)
    }));
  };

  const removeInterest = (index: number) => {
    setPersonaForm(prev => ({
      ...prev,
      interests: prev.interests.filter((_, idx) => idx !== index)
    }));
  };

  const addTrait = () => {
    setPersonaForm(prev => ({ ...prev, distinctiveTraits: [...prev.distinctiveTraits, ''] }));
  };

  const updateTrait = (index: number, value: string) => {
    setPersonaForm(prev => ({
      ...prev,
      distinctiveTraits: prev.distinctiveTraits.map((t, idx) => idx === index ? value : t)
    }));
  };

  const removeTrait = (index: number) => {
    setPersonaForm(prev => ({
      ...prev,
      distinctiveTraits: prev.distinctiveTraits.filter((_, idx) => idx !== index)
    }));
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pl-16 md:pl-4 pr-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center justify-between md:justify-start md:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {currentPersona.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm md:text-base">{currentPersona.name}</h3>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{currentPersona.role}</p>
              </div>
            </div>

            {onAddPersona && (
              <button
                onClick={openAddModal}
                className="md:hidden px-2 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600 transition-colors"
              >
                + Add
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {personas.map((persona) => (
                <div key={persona.id} className="flex items-center space-x-1">
                  <button
                    onClick={() => !hasMessages && onPersonaChange(persona)}
                    disabled={hasMessages && persona.id !== currentPersona.id}
                    className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm transition-colors ${
                      persona.id === currentPersona.id
                        ? 'bg-blue-500 text-white'
                        : hasMessages
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title={hasMessages && persona.id !== currentPersona.id ? 'Cannot switch persona during conversation' : ''}
                  >
                    {persona.name}
                  </button>
                  {!isBuiltIn(persona) && onUpdatePersona && (
                    <button
                      onClick={() => openEditModal(persona)}
                      className="text-blue-500 hover:text-blue-700 text-sm px-1 hidden md:inline"
                      title="Edit persona"
                    >
                      ✏️
                    </button>
                  )}
                </div>
              ))}
            </div>

            {onAddPersona && (
              <button
                onClick={openAddModal}
                className="hidden md:block px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition-colors whitespace-nowrap"
              >
                + Add Friend
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Persona Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {isEditing ? 'Edit Persona' : 'Create New Friend'}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={personaForm.name}
                    onChange={(e) => setPersonaForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Alex Chen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={personaForm.role}
                    onChange={(e) => setPersonaForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={personaForm.gender}
                    onChange={(e) => setPersonaForm(prev => ({ ...prev, gender: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={personaForm.age}
                    onChange={(e) => setPersonaForm(prev => ({ ...prev, age: parseInt(e.target.value) || 25 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="120"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                <textarea
                  value={personaForm.background}
                  onChange={(e) => setPersonaForm(prev => ({ ...prev, background: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Brief background story..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personality</label>
                <textarea
                  value={personaForm.personality}
                  onChange={(e) => setPersonaForm(prev => ({ ...prev, personality: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Describe personality traits..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                {personaForm.interests.map((interest, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={interest}
                      onChange={(e) => updateInterest(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Technology, Music"
                    />
                    <button
                      onClick={() => removeInterest(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addInterest}
                  className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                >
                  + Add Interest
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Communication Style</label>
                <textarea
                  value={personaForm.communicationStyle}
                  onChange={(e) => setPersonaForm(prev => ({ ...prev, communicationStyle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="How does this persona communicate?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distinctive Traits</label>
                {personaForm.distinctiveTraits.map((trait, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={trait}
                      onChange={(e) => updateTrait(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Always gives practical advice"
                    />
                    <button
                      onClick={() => removeTrait(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addTrait}
                  className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                >
                  + Add Trait
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AI Prompt *</label>
                <textarea
                  value={personaForm.prompt}
                  onChange={(e) => setPersonaForm(prev => ({ ...prev, prompt: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Write the complete AI prompt for this persona. Include personality, background, and communication style."
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              {isEditing && editingPersonaId && !isBuiltIn(personas.find(p => p.id === editingPersonaId)!) && onDeletePersona && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this persona?')) {
                      onDeletePersona(editingPersonaId);
                      setShowModal(false);
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete Friend
                </button>
              )}
              <div className="flex space-x-3 ml-auto">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePersona}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {isEditing ? 'Update Friend' : 'Create Friend'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}