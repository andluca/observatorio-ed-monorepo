"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent, Editor, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';

import {
  Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, Link as LinkIcon,
  Image as ImageIcon, AlignLeft, AlignCenter, AlignJustify,
  Save, Eye, ArrowLeft, Loader2, Upload, X
} from 'lucide-react';

import { createPost, updatePost } from '@/actions/post-actions';
import { uploadImage } from '@/actions/upload-action';
import { CreatePostInput, UpdatePostInput } from '@/lib/schemas';
import { Post } from '@prisma/client';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize: null }).run();
      },
    };
  },
});

const AVAILABLE_CATEGORIES = [
  "Análise Política",
  "Movimentos Sociais",
  "Democracia",
  "Autoritarismo",
  "Economia",
  "Direitos Humanos"
];

const MenuBar = ({ editor, onUploadImage }: { editor: Editor | null, onUploadImage: () => void }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL do link:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const btnClass = (isActive: boolean) =>
    `p-2 rounded text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200 ${isActive ? 'bg-gray-200 text-black border-gray-300' : 'bg-white'
    }`;

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-white border-b border-gray-200 sticky top-0 z-10 items-center">
      <select
        onChange={(e) => {
          if (e.target.value) editor.chain().focus().setFontSize(e.target.value).run();
          else editor.chain().focus().unsetFontSize().run();
        }}
        className="h-9 px-2 text-sm border border-gray-200 rounded bg-white text-black focus:outline-none focus:border-[#FFC700] cursor-pointer"
        defaultValue=""
      >
        <option value="">Tamanho</option>
        <option value="12px">Pequeno (12px)</option>
        <option value="16px">Normal (16px)</option>
        <option value="20px">Médio (20px)</option>
        <option value="24px">Grande (24px)</option>
        <option value="32px">Título (32px)</option>
      </select>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Negrito"><Bold size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Itálico"><Italic size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))} title="Sublinhado"><UnderlineIcon size={18} /></button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Lista"><List size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="Lista Numérica"><ListOrdered size={18} /></button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))} title="Esquerda"><AlignLeft size={18} /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))} title="Centralizar"><AlignCenter size={18} /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={btnClass(editor.isActive({ textAlign: 'justify' }))} title="Justificar"><AlignJustify size={18} /></button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button onClick={setLink} className={btnClass(editor.isActive('link'))} title="Link"><LinkIcon size={18} /></button>
      <button onClick={onUploadImage} className={btnClass(false)} title="Inserir Imagem"><ImageIcon size={18} /></button>
    </div>
  );
};


interface PostEditorProps {
  initialData?: Partial<Post>;
}

export function PostEditor({ initialData }: PostEditorProps) {
  const router = useRouter();

  const STORAGE_KEY = initialData?.id ? `draft_post_${initialData.id}` : 'draft_new_post';

  const [title, setTitle] = useState(initialData?.title || '');
  const [categories, setCategories] = useState<string[]>(initialData?.categories || []);
  const [coverImage, setCoverImage] = useState<string>(initialData?.coverImage || '');
  const [type, setType] = useState<"ARTICLE" | "TEXT">((initialData?.type as "ARTICLE" | "TEXT") || "ARTICLE");
  
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [readTime, setReadTime] = useState(initialData?.readTime || 5);
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || ''); // String para edição

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Comece a escrever seu artigo aqui...',
      }),
      Underline,
      TextStyle,
      FontSize,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-500 underline cursor-pointer' },
      }),
      ImageExtension.configure({
        inline: true,
        HTMLAttributes: { class: 'rounded-lg max-w-full my-4' },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: initialData?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6 text-black bg-white',
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
       saveToLocalStorage({ content: editor.getHTML() });
    }
  });

  const saveToLocalStorage = (partialData: Record<string, any>) => {
    const currentSaved = localStorage.getItem(STORAGE_KEY);
    const parsedSaved = currentSaved ? JSON.parse(currentSaved) : {};

    const newData = { ...parsedSaved, ...partialData, updatedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  useEffect(() => {
    saveToLocalStorage({
      title,
      categories,
      coverImage,
      type,
      excerpt,
      readTime,
      featured,
      tagsInput
    });
  }, [title, categories, coverImage, type, excerpt, readTime, featured, tagsInput]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      
      parsed.title && setTitle(parsed.title);
      parsed.categories && setCategories(parsed.categories);
      parsed.coverImage && setCoverImage(parsed.coverImage);
      parsed.type && setType(parsed.type);
      parsed.excerpt && setExcerpt(parsed.excerpt);
      parsed.readTime && setReadTime(parsed.readTime);
      parsed.tagsInput && setTagsInput(parsed.tagsInput);
      
      if (parsed.featured !== undefined) setFeatured(parsed.featured);

      if (editor && parsed.content && parsed.content !== initialData?.content) {
        editor.commands.setContent(parsed.content);
      }

      setIsRestored(true);
      const timer = setTimeout(() => setIsRestored(false), 3000);
      return () => clearTimeout(timer); // Cleanup do timer

    } catch (e) {
      console.error("Erro ao ler rascunho, limpando cache corrompido...");
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [editor, STORAGE_KEY, initialData]);

  const handleUpload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);
    setIsUploading(false);

    if (result.error) {
      alert(result.error);
      return null;
    }
    return result.url;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleUpload(file);
      if (url) setCoverImage(url);
    }
  };

  const handleEditorImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (file && editor) {
        const url = await handleUpload(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    };
    input.click();
  };

  const toggleCategory = (cat: string) => {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async (publishStatus: boolean) => {
    if (!title.trim()) return alert("O título é obrigatório");
    if (!editor) return;

    setIsLoading(true);

    const contentHTML = editor.getHTML();
    
    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    let result;

    if (initialData?.id) {
      const payload: UpdatePostInput = {
        id: initialData.id,
        title,
        content: contentHTML,
        published: publishStatus,
        categories,
        coverImage: coverImage || null,
        type,
        // Novos campos
        excerpt,
        featured,
        readTime,
        tags: tagsArray,
      };
      result = await updatePost(payload);
    } else {
      const payload: CreatePostInput = {
        title,
        content: contentHTML,
        published: publishStatus,
        categories,
        coverImage: coverImage || null,
        type,
        // Novos campos
        excerpt,
        featured,
        readTime,
        tags: tagsArray,
      };
      result = await createPost(payload);
    }

    setIsLoading(false);

    if (result.error) {
      alert(result.error);
    } else {
      router.push('/admin/dashboard');
      router.refresh();
    }
  };
  return (
    <div className="min-h-screen bg-[#F5F3EB] pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </button>
          <div className="text-sm text-gray-400 font-medium">
            {initialData ? 'Editando Post' : 'Novo Artigo'}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-9 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Título do Post
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do seu post..."
                className="w-full text-lg p-3 bg-white text-black border border-gray-200 rounded-md focus:ring-2 focus:ring-[#FFC700] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col relative">
              <MenuBar editor={editor} onUploadImage={handleEditorImageUpload} />

              {isUploading && (
                <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-[#FFC700] font-bold">
                    <Loader2 className="animate-spin" /> Fazendo Upload...
                  </div>
                </div>
              )}

              <div className="flex-1">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6 text-gray-700">
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Publicação</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleSave(false)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                  Salvar como Rascunho
                </button>

                <button
                  onClick={() => handleSave(true)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#FFC700] hover:bg-[#E5B300] border border-transparent rounded-md text-sm font-bold text-black shadow-sm transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  Publicar
                </button>
              </div>
            </div>

             {/* 2. Destaque & Leitura (NOVO) */}
             <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
               <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-2">Configurações</h3>
               
               {/* Destaque Toggle */}
               <label className="flex items-center gap-3 cursor-pointer select-none">
                 <div className="relative">
                   <input 
                     type="checkbox" 
                     checked={featured} 
                     onChange={(e) => setFeatured(e.target.checked)}
                     className="sr-only peer"
                   />
                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFC700]"></div>
                 </div>
                 <span className="text-sm font-medium text-gray-700">Destaque na Home</span>
               </label>

               {/* Tempo de Leitura */}
               <div>
                 <label className="text-xs font-semibold text-gray-700 mb-1 block">Tempo de Leitura (min)</label>
                 <input 
                   type="number"
                   min="1"
                   value={readTime}
                   onChange={(e) => setReadTime(parseInt(e.target.value) || 0)}
                   className="w-full p-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#FFC700] outline-none"
                 />
               </div>
             </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Tipo de Conteúdo</h3>
              <div className="space-y-3">
                <label className={`flex items-center p-3 border rounded-md cursor-pointer transition-all ${type === 'TEXT' ? 'border-[#FFC700] bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="postType"
                    checked={type === 'TEXT'}
                    onChange={() => setType('TEXT')}
                    className="h-4 w-4 text-[#FFC700] focus:ring-[#FFC700] border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-gray-900">Texto / Notícia</span>
                    <span className="block text-xs text-gray-500">Para blog, informes e atualizações rápidas.</span>
                  </div>
                </label>

                <label className={`flex items-center p-3 border rounded-md cursor-pointer transition-all ${type === 'ARTICLE' ? 'border-[#FFC700] bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="postType"
                    checked={type === 'ARTICLE'}
                    onChange={() => setType('ARTICLE')}
                    className="h-4 w-4 text-[#FFC700] focus:ring-[#FFC700] border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-gray-900">Artigo Acadêmico</span>
                    <span className="block text-xs text-gray-500">Para análises aprofundadas e material científico.</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
               <h3 className="text-sm font-bold text-gray-900 mb-2">Resumo (Excerpt)</h3>
               <p className="text-xs text-gray-500 mb-2">Texto curto para o card. Evita cortes.</p>
               <textarea 
                 value={excerpt}
                 onChange={(e) => setExcerpt(e.target.value)}
                 className="w-full h-24 p-3 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#FFC700] outline-none resize-none"
                 placeholder="Digite um resumo..."
               />
            </div>


            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Imagem de Destaque</h3>
              <div className="space-y-3">
                {!coverImage ? (
                  <label className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center text-center cursor-pointer hover:bg-gray-100 transition-colors relative">
                    {isUploading ? <Loader2 className="animate-spin w-6 h-6 text-gray-400" /> : <Upload className="w-6 h-6 text-gray-400 mb-2" />}
                    <span className="text-xs text-gray-500">{isUploading ? 'Enviando...' : 'Clique para upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative group">
                    <img src={coverImage} alt="Capa" className="w-full h-32 object-cover rounded-md border border-gray-200" />
                    <button
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      title="Remover imagem"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <div className="text-xs text-center text-gray-400">
                  {coverImage ? 'Imagem definida' : 'Nenhuma imagem selecionada'}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
               <h3 className="text-sm font-bold text-gray-900 mb-2">Tags</h3>
               <input 
                 type="text"
                 value={tagsInput}
                 onChange={(e) => setTagsInput(e.target.value)}
                 placeholder="política, economia, brasil"
                 className="w-full p-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#FFC700] outline-none"
               />
               <p className="text-xs text-gray-400 mt-1">Separe por vírgulas.</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Categorias</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {AVAILABLE_CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded -ml-1">
                    <input
                      type="checkbox"
                      checked={categories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded border-gray-300 text-[#FFC700] focus:ring-[#FFC700]"
                    />
                    <span className="text-sm text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}