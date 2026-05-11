import { useState, useEffect } from 'react'
import { X, Hash, Sparkles, Image as ImageIcon, Check } from 'lucide-react'
import {
  functionName,
  projectId,
  publicAnonKey,
} from '../../../utils/supabase/info'

interface ServerImage {
  id: string
  url: string
  timestamp: string
}

interface ChatMessage {
  id: string
  image?: string | null
  timestamp?: string
  type?: 'text' | 'image'
}

interface ServerDisplaySettingsModalProps {
  isOpen: boolean
  onClose: () => void
  serverId: string
  serverName: string
  currentDisplayType: 'text' | 'highlight' | 'image'
  currentThumbnail?: string
  onSave: (
    displayType: 'text' | 'highlight' | 'image',
    thumbnail?: string,
  ) => void
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/${functionName}`

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return 'Unknown time'
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return 'Unknown time'
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export function ServerDisplaySettingsModal({
  isOpen,
  onClose,
  serverId,
  serverName,
  currentDisplayType,
  currentThumbnail,
  onSave,
}: ServerDisplaySettingsModalProps) {
  const [selectedType, setSelectedType] = useState<
    'text' | 'highlight' | 'image'
  >(currentDisplayType)
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    currentThumbnail,
  )
  const [serverImages, setServerImages] = useState<ServerImage[]>([])
  const [loadingImages, setLoadingImages] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    setSelectedType(currentDisplayType)
    setSelectedImage(currentThumbnail)

    const loadServerImages = async () => {
      setLoadingImages(true)
      try {
        const response = await fetch(`${API_BASE}/messages/${serverId}`, {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load server messages')
        }

        const data = await response.json()
        const messages: ChatMessage[] = Array.isArray(data.messages)
          ? data.messages
          : []

        const imageMessages = messages
          .filter(
            (message) =>
              message.type === 'image' &&
              typeof message.image === 'string' &&
              message.image.length > 0,
          )
          .map((message) => ({
            id: message.id,
            url: message.image as string,
            timestamp: formatTimestamp(message.timestamp),
          }))
          .reverse()

        setServerImages(imageMessages)

        if (
          currentThumbnail &&
          imageMessages.some((img) => img.url === currentThumbnail)
        ) {
          setSelectedImage(currentThumbnail)
        } else if (
          !currentThumbnail &&
          imageMessages.length > 0 &&
          selectedType === 'image'
        ) {
          setSelectedImage(imageMessages[0].url)
        }
      } catch (error) {
        console.error('Error loading server images:', error)
        setServerImages([])
      } finally {
        setLoadingImages(false)
      }
    }

    loadServerImages()
  }, [isOpen, serverId, currentDisplayType, currentThumbnail, selectedType])

  const handleSave = () => {
    if (selectedType === 'image' && !selectedImage) {
      alert('이미지를 선택해주세요.')
      return
    }
    onSave(selectedType, selectedType === 'image' ? selectedImage : undefined)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                서버 표시 설정
              </h2>
              <p className="text-sm text-gray-600 mt-1">#{serverName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              표시 방식 선택
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedType('text')}
                className={`p-4 rounded-xl border-2 transition-all ${selectedType === 'text' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedType === 'text' ? 'bg-purple-500' : 'bg-gray-200'}`}
                  >
                    <Hash
                      className={`w-6 h-6 ${selectedType === 'text' ? 'text-white' : 'text-gray-600'}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${selectedType === 'text' ? 'text-purple-600' : 'text-gray-700'}`}
                  >
                    텍스트
                  </span>
                </div>
              </button>

              <button
                onClick={() => setSelectedType('highlight')}
                className={`p-4 rounded-xl border-2 transition-all ${selectedType === 'highlight' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedType === 'highlight' ? 'bg-pink-500' : 'bg-gray-200'}`}
                  >
                    <Sparkles
                      className={`w-6 h-6 ${selectedType === 'highlight' ? 'text-white' : 'text-gray-600'}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${selectedType === 'highlight' ? 'text-pink-600' : 'text-gray-700'}`}
                  >
                    하이라이트
                  </span>
                </div>
              </button>

              <button
                onClick={() => setSelectedType('image')}
                className={`p-4 rounded-xl border-2 transition-all ${selectedType === 'image' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedType === 'image' ? 'bg-blue-500' : 'bg-gray-200'}`}
                  >
                    <ImageIcon
                      className={`w-6 h-6 ${selectedType === 'image' ? 'text-white' : 'text-gray-600'}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${selectedType === 'image' ? 'text-blue-600' : 'text-gray-700'}`}
                  >
                    이미지
                  </span>
                </div>
              </button>
            </div>
          </div>

          {selectedType === 'image' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                대표 이미지 선택 ({serverImages.length}개)
              </h3>
              {loadingImages ? (
                <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-xl">
                  <p className="text-gray-600">채팅 이미지를 불러오는 중...</p>
                </div>
              ) : serverImages.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-xl">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    이 서버 채팅에 저장된 이미지가 없습니다.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    채팅에서 이미지를 전송한 후 다시 시도해주세요.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {serverImages.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === image.url ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'}`}
                    >
                      <img
                        src={image.url}
                        alt={`Server image ${image.id}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === image.url && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs text-white font-medium">
                          {image.timestamp}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium hover:from-purple-700 hover:to-pink-600 transition-all shadow-md"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
