import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Respondo',
      description: 'Your intelligent support assistant',
      features: {
        title: 'Key Features',
        realtime: 'Real-time chat with AI assistance',
        multilingual: 'Multilingual support',
        secure: 'Secure and private conversations'
      },
      auth: {
        signin: 'Sign In',
        signup: 'Sign Up',
        errors: {
          offline: 'No internet connection. Please check your connection and try again.',
          config: 'Authentication service is not properly configured.',
          googleAuth: 'Error connecting to Google. Please try again later.',
          connectionRejected: 'Connection to authentication service was rejected. Please check your internet connection and try again.'
        },
        email: 'Email',
        password: 'Password',
        or: 'or',
        googleSignIn: 'Continue with Google',
        logout: 'Log Out',
        forgotPassword: 'Forgot Password?',
        alreadyHaveAccount: 'Already have an account?',
        dontHaveAccount: "Don't have an account?",
        createAccount: 'Create Account'
      },
      profile: {
        title: 'Profile',
        name: 'Name',
        createdAt: 'Created At',
        save: 'Save Changes'
      },
      tickets: {
        title: 'Tickets',
        new: 'New Ticket',
        status: 'Status',
        priority: 'Priority',
        category: 'Category',
        edit: 'Edit Ticket',
        create: 'Create Ticket',
        search: 'Search tickets...',
        allStatuses: 'All Statuses',
        allPriorities: 'All Priorities',
        allCategories: 'All Categories',
        id: 'ID',
        fields: {
          title: 'Title',
          description: 'Description',
          status: 'Status',
          priority: 'Priority',
          category: 'Category',
          assignedTo: 'Assigned To'
        },
        status: {
          open: 'Open',
          inProgress: 'In Progress',
          waitingClient: 'Waiting Client',
          resolved: 'Resolved',
          closed: 'Closed'
        },
        priority: {
          low: 'Low',
          medium: 'Medium',
          high: 'High',
          critical: 'Critical'
        },
        category: {
          hardware: 'Hardware',
          software: 'Software',
          billing: 'Billing',
          network: 'Network',
          security: 'Security',
          other: 'Other'
        },
        assignedTo: 'Assigned To',
        createdAt: 'Created At',
        unassigned: 'Unassigned',
        noTickets: 'No tickets found',
        comments: 'Comments',
        noComments: 'No comments yet',
        addComment: 'Add a comment...'
      },
      chat: {
        placeholder: 'Pregunta algo',
        title: 'Chat',
        messages: 'Messages',
        send: 'Send',
        noMessages: 'No messages yet'
      },
      common: {
        save: 'Save',
        saving: 'Saving...',
        loading: 'Loading...',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        copy: 'Copy'
      },
      settings: {
        title: 'Settings',
        apiKeys: {
          title: 'API Keys',
          description: 'Manage your API keys for accessing the API',
          generate: 'Generate New Key',
          keyDescription: 'Key Description',
          descriptionPlaceholder: 'Enter a description for this key',
          key: 'Key',
          created: 'Created',
          status: 'Status',
          actions: 'Actions',
          noKeys: 'No API keys found',
          active: 'Active',
          revoked: 'Revoked',
          revoke: 'Revoke',
          copy: 'Copy to clipboard',
          saveKeyWarning: 'Make sure to copy this key now. You won\'t be able to see it again!',
          confirmRevoke: 'Are you sure you want to revoke this API key?',
          confirmDelete: 'Are you sure you want to delete this API key?',
          errors: {
            loadError: 'Error loading API keys',
            generateError: 'Error generating API key',
            duplicateDescription: 'An API key with this description already exists',
            authError: 'Authentication error',
            notAuthenticated: 'User not authenticated',
            validationError: 'Validation error: missing required fields',
            revokeError: 'Error revoking API key',
            deleteError: 'Error deleting API key',
            copyError: 'Error copying to clipboard'
          }
        }
      },
      documents: {
        title: 'Documents',
        upload: 'Upload Document',
        name: 'Name',
        type: 'Type',
        size: 'Size',
        status: {
          title: 'Status',
          pending: 'Pending',
          processing: 'Processing',
          uploading: 'Uploading...',
          completed: 'Completed',
          error: 'Error'
        },
        createdAt: 'Created At',
        actions: 'Actions',
        noDocuments: 'No documents found',
        errors: {
          sizeLimit: 'File size exceeds 10MB limit',
          invalidType: 'Invalid file type. Allowed types: txt, doc, docx, pdf, ppt, pptx',
          uploadError: 'Error uploading document',
          deleteError: 'Error deleting document. Please try again.'
        },
        confirmDelete: 'Are you sure you want to delete this document?'
      },
      assistant: {
        title: 'Assistant',
        searchConversations: 'Search conversations...',
        active: 'Active',
        archived: 'Archived',
        noConversations: 'No conversations found',
        export: 'Export conversation',
        archive: 'Archive conversation',
        selectConversation: 'Select a conversation',
        selectConversationDescription: 'Choose a conversation from the list to view the chat history',
        status: 'Status',
        noMessages: 'No messages in this conversation'
      }
    }
  },
  es: {
    translation: {
      welcome: 'Bienvenido a Respondo',
      description: 'Tu asistente de soporte inteligente',
      features: {
        title: 'Características Principales',
        realtime: 'Chat en tiempo real con asistencia de IA',
        multilingual: 'Soporte multilingüe',
        secure: 'Conversaciones seguras y privadas'
      },
      auth: {
        signin: 'Iniciar Sesión',
        signup: 'Registrarse',
        errors: {
          offline: 'Sin conexión a internet. Por favor, verifica tu conexión e inténtalo de nuevo.',
          config: 'El servicio de autenticación no está configurado correctamente.',
          googleAuth: 'Error al conectar con Google. Por favor, inténtalo más tarde.',
          connectionRejected: 'La conexión al servicio de autenticación fue rechazada. Por favor, verifica tu conexión a internet e inténtalo de nuevo.'
        },
        email: 'Correo electrónico',
        password: 'Contraseña',
        or: 'o',
        googleSignIn: 'Continuar con Google',
        logout: 'Cerrar Sesión',
        forgotPassword: '¿Olvidaste tu contraseña?',
        alreadyHaveAccount: '¿Ya tienes una cuenta?',
        dontHaveAccount: '¿No tienes una cuenta?',
        createAccount: 'Crear Cuenta'
      },
      profile: {
        title: 'Perfil',
        name: 'Nombre',
        createdAt: 'Fecha de Creación',
        save: 'Guardar Cambios'
      },
      tickets: {
        title: 'Tickets',
        new: 'Nuevo Ticket',
        edit: 'Editar Ticket',
        create: 'Crear Ticket',
        search: 'Buscar tickets...',
        allStatuses: 'Todos los Estados',
        allPriorities: 'Todas las Prioridades',
        allCategories: 'Todas las Categorías',
        id: 'ID',
        fields: {
          title: 'Título',
          description: 'Descripción',
          status: 'Estado',
          priority: 'Prioridad',
          category: 'Categoría',
          assignedTo: 'Asignado a'
        },
        status: {
          open: 'Abierto',
          inProgress: 'En Progreso',
          waitingClient: 'Esperando Cliente',
          resolved: 'Resuelto',
          closed: 'Cerrado'
        },
        priority: {
          low: 'Baja',
          medium: 'Media',
          high: 'Alta',
          critical: 'Crítica'
        },
        category: {
          hardware: 'Hardware',
          software: 'Software',
          billing: 'Facturación',
          network: 'Red',
          security: 'Seguridad',
          other: 'Otro'
        },
        assignedTo: 'Asignado a',
        createdAt: 'Creado el',
        unassigned: 'Sin asignar',
        noTickets: 'No se encontraron tickets',
        comments: 'Comentarios',
        noComments: 'No hay comentarios aún',
        addComment: 'Agregar un comentario...'
      },
      chat: {
        placeholder: 'Pregunta algo',
        title: 'Chat',
        messages: 'Mensajes',
        send: 'Enviar',
        noMessages: 'No hay mensajes aún'
      },
      common: {
        save: 'Guardar',
        saving: 'Guardando...',
        loading: 'Cargando...',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        close: 'Cerrar',
        copy: 'Copiar'
      },
      settings: {
        title: 'Configuración',
        apiKeys: {
          title: 'Claves API',
          description: 'Gestiona tus claves API para acceder a la API',
          generate: 'Generar Nueva Clave',
          keyDescription: 'Descripción de la Clave',
          descriptionPlaceholder: 'Ingresa una descripción para esta clave',
          key: 'Clave',
          created: 'Creada',
          status: 'Estado',
          actions: 'Acciones',
          noKeys: 'No se encontraron claves API',
          active: 'Activa',
          revoked: 'Revocada',
          revoke: 'Revocar',
          copy: 'Copiar al portapapeles',
          saveKeyWarning: '¡Asegúrate de copiar esta clave ahora. No podrás verla de nuevo!',
          confirmRevoke: '¿Estás seguro de que deseas revocar esta clave API?',
          confirmDelete: '¿Estás seguro de que deseas eliminar esta clave API?',
          errors: {
            loadError: 'Error al cargar las claves API',
            generateError: 'Error al generar la clave API',
            duplicateDescription: 'Ya existe una clave API con esta descripción',
            authError: 'Error de autenticación',
            notAuthenticated: 'Usuario no autenticado',
            validationError: 'Error de validación: campos requeridos faltantes',
            revokeError: 'Error al revocar la clave API',
            deleteError: 'Error al eliminar la clave API',
            copyError: 'Error al copiar al portapapeles'
          }
        }
      },
      documents: {
        title: 'Documentos',
        upload: 'Subir Documento',
        name: 'Nombre',
        type: 'Tipo',
        size: 'Tamaño',
        status: {
          title: 'Estado',
          pending: 'Pendiente',
          processing: 'Procesando',
          uploading: 'Subiendo...',
          completed: 'Completado',
          error: 'Error'
        },
        createdAt: 'Creado el',
        actions: 'Acciones',
        noDocuments: 'No se encontraron documentos',
        errors: {
          sizeLimit: 'El tamaño del archivo excede el límite de 10MB',
          invalidType: 'Tipo de archivo inválido. Tipos permitidos: txt, doc, docx, pdf, ppt, pptx',
          uploadError: 'Error al subir el documento',
          deleteError: 'Error al eliminar el documento. Por favor, inténtalo de nuevo.'
        },
        confirmDelete: '¿Estás seguro de que deseas eliminar este documento?'
      },
      assistant: {
        title: 'Asistente',
        searchConversations: 'Buscar conversaciones...',
        active: 'Activas',
        archived: 'Archivadas',
        noConversations: 'No se encontraron conversaciones',
        export: 'Exportar conversación',
        archive: 'Archivar conversación',
        selectConversation: 'Selecciona una conversación',
        selectConversationDescription: 'Elige una conversación de la lista para ver el historial',
        status: 'Estado',
        noMessages: 'No hay mensajes en esta conversación'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;