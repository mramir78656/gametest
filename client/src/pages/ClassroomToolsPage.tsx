import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Filter, FileText, Eye, Calendar, User } from 'lucide-react';

interface TeacherResource {
  id: number;
  title: string;
  type: string;
  subject: string;
  grade: string;
  description: string;
  fileFormat: string;
  downloadUrl: string;
  previewImage: string;
  tags: string[];
  dateAdded: string;
  pages?: number;
  difficulty?: string;
}

const ClassroomToolsPage = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<number | null>(null);

  // Fetch resources from API
  const { data: resources = [], isLoading, error } = useQuery({
    queryKey: ['/api/classroom-resources', selectedSubject, selectedGrade, selectedType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedSubject !== 'all') params.append('subject', selectedSubject);
      if (selectedGrade !== 'all') params.append('grade', selectedGrade);
      if (selectedType !== 'all') params.append('type', selectedType);
      
      const response = await fetch(`/api/classroom-resources?${params}`);
      if (!response.ok) throw new Error('Failed to fetch resources');
      return response.json();
    }
  });

  // Filter options
  const subjects = [
    { id: 'all', name: 'All Subjects', icon: '📚' },
    { id: 'math', name: 'Math', icon: '🔢' },
    { id: 'english', name: 'English', icon: '📝' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'computer', name: 'Computer', icon: '💻' },
    { id: 'art', name: 'Art', icon: '🎨' },
    { id: 'critical-thinking', name: 'Critical Thinking', icon: '🧠' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'general-knowledge', name: 'General Knowledge', icon: '🌍' }
  ];

  const grades = [
    { id: 'all', name: 'All Grades' },
    { id: 'prek', name: 'PreK' },
    { id: 'kindergarten', name: 'Kindergarten' },
    { id: 'grade-1', name: 'Grade 1' },
    { id: 'grade-2', name: 'Grade 2' },
    { id: 'grade-3', name: 'Grade 3' },
    { id: 'grade-4', name: 'Grade 4' },
    { id: 'grade-5', name: 'Grade 5' },
    { id: 'grade-6', name: 'Grade 6' }
  ];

  const resourceTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'worksheet', name: 'Worksheets', icon: '📄' },
    { id: 'poster', name: 'Posters', icon: '📋' },
    { id: 'flashcards', name: 'Flashcards', icon: '🗃️' },
    { id: 'template', name: 'Templates', icon: '📝' },
    { id: 'guide', name: 'Guides', icon: '📖' }
  ];

  // Filter resources by search term
  const filteredResources = resources.filter((resource: TeacherResource) =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDownload = async (resource: TeacherResource) => {
    setIsDownloading(resource.id);
    try {
      const resourceId = resource.downloadUrl.split('/').pop();
      const response = await fetch(`/api/download-resource/${resourceId}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resource.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download resource. Please try again.');
    } finally {
      setIsDownloading(null);
    }
  };

  const handlePreview = (resource: TeacherResource) => {
    const resourceId = resource.downloadUrl.split('/').pop();
    window.open(`/api/resource-preview/${resourceId}`, '_blank');
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      math: 'bg-blue-100 text-blue-800 border-blue-200',
      english: 'bg-green-100 text-green-800 border-green-200',
      science: 'bg-purple-100 text-purple-800 border-purple-200',
      computer: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      art: 'bg-pink-100 text-pink-800 border-pink-200',
      'critical-thinking': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      music: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'general-knowledge': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const clearAllFilters = () => {
    setSelectedSubject('all');
    setSelectedGrade('all');
    setSelectedType('all');
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading classroom resources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load resources. Please try again.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Classroom Tools & Resources | Educational Gaming</title>
        <meta name="description" content="Download worksheets, posters, flashcards and teaching materials organized by subject and grade level." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Classroom Tools & Resources</h1>
          <p className="text-lg text-gray-600 mb-4">Download printable teaching materials organized by subject and grade level</p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {resources.length} Resources Available
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              PDF Format
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Teacher Approved
            </span>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Find Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Search resources by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Subject Filter */}
              <div>
                <label className="block text-sm font-medium mb-3">Subject</label>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map((subject) => (
                    <Button
                      key={subject.id}
                      variant={selectedSubject === subject.id ? "default" : "outline"}
                      onClick={() => setSelectedSubject(subject.id)}
                      className="flex items-center justify-start gap-2 text-sm h-10"
                    >
                      <span>{subject.icon}</span>
                      <span className="truncate">{subject.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Grade Filter */}
              <div>
                <label className="block text-sm font-medium mb-3">Grade Level</label>
                <select 
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                  ))}
                </select>
              </div>

              {/* Resource Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-3">Resource Type</label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {resourceTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2">
              {selectedSubject !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Subject: {subjects.find(s => s.id === selectedSubject)?.name}
                  <button 
                    onClick={() => setSelectedSubject('all')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedGrade !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Grade: {grades.find(g => g.id === selectedGrade)?.name}
                  <button 
                    onClick={() => setSelectedGrade('all')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedType !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Type: {resourceTypes.find(t => t.id === selectedType)?.name}
                  <button 
                    onClick={() => setSelectedType('all')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {(selectedSubject !== 'all' || selectedGrade !== 'all' || selectedType !== 'all' || searchTerm) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
          </p>
          {filteredResources.length > 0 && (
            <div className="text-sm text-gray-500">
              Sort by: Most Recent
            </div>
          )}
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No resources found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search terms to find more resources.</p>
              <Button onClick={clearAllFilters}>Clear All Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((resource: TeacherResource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-200">
                {/* Resource Preview */}
                <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden rounded-t-lg">
                  <img 
                    src={resource.previewImage || `/api/resource-preview/${resource.downloadUrl.split('/').pop()}`}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/api/resource-preview/default';
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePreview(resource)}
                    className="absolute top-2 right-2 opacity-75 hover:opacity-100"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                {/* Resource Details */}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1">
                      {resource.title}
                    </h3>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {resource.fileFormat}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {resource.description}
                  </p>

                  {/* Meta Information */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getSubjectColor(resource.subject)}>
                        {subjects.find(s => s.id === resource.subject)?.icon} {subjects.find(s => s.id === resource.subject)?.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {grades.find(g => g.id === resource.grade)?.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {resourceTypes.find(t => t.id === resource.type)?.name}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(resource.dateAdded).toLocaleDateString()}
                      </span>
                      {resource.pages && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {resource.pages} page{resource.pages !== 1 ? 's' : ''}
                        </span>
                      )}
                      {resource.difficulty && (
                        <span className={`px-2 py-1 rounded text-xs ${
                          resource.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          resource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {resource.difficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {resource.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{resource.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={() => handleDownload(resource)}
                    disabled={isDownloading === resource.id}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isDownloading === resource.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-900">Need Custom Resources?</h2>
            <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
              Can't find exactly what you need? Our education specialists can create custom teaching materials tailored to your specific curriculum requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Request Custom Materials
                </Button>
              </Link>
              <Link href="/teachers">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Explore Teacher Tools
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 mx-auto">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassroomToolsPage;