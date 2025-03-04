import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Copy, Key, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export function ApiKeys() {
  const { t } = useTranslation();
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKey, setNewKey] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      setError(t('settings.apiKeys.errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    setError(null);
    setLoading(true);
    setNewKey(null);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw new Error(t('settings.apiKeys.errors.authError'));
      if (!user) throw new Error(t('settings.apiKeys.errors.notAuthenticated'));

      const key = `sk-${uuidv4()}`;

      const { error: insertError } = await supabase
        .from('api_keys')
        .insert([{
          description,
          key,
          user_id: user.id,
          created_by: user.id
        }]);

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error(t('settings.apiKeys.errors.duplicateDescription'));
        }
        if (insertError.code === '23502') {
          throw new Error(t('settings.apiKeys.errors.validationError'));
        }
        throw new Error(t('settings.apiKeys.errors.generateError'));
      }

      setNewKey(key);
      setDescription('');
      fetchApiKeys();
    } catch (error) {
      console.error('Error al generar clave API:', error);
      setError(error.message || t('settings.apiKeys.errors.generateError'));
    } finally {
      setLoading(false);
    }
  };

  const revokeApiKey = async (id) => {
    if (!window.confirm(t('settings.apiKeys.confirmRevoke'))) return;
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase
        .from('api_keys')
        .update({
          revoked_at: new Date().toISOString(),
          user_id: (await supabase.auth.getUser()).data.user.id
        })
        .eq('id', id);

      if (error) {
        console.error('Error revoking API key:', error);
        throw new Error(t('settings.apiKeys.errors.revokeError'));
      }

      fetchApiKeys();
    } catch (error) {
      console.error('Error revoking API key:', error);
      setError(t('settings.apiKeys.errors.revokeError'));
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (id) => {
    if (!window.confirm(t('settings.apiKeys.confirmDelete'))) return;
    setError(null);

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchApiKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
      setError(t('settings.apiKeys.errors.deleteError'));
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      setError(t('settings.apiKeys.errors.copyError'));
    }
  };

  const maskApiKey = (key) => {
    return `${key.slice(0, 8)}...${key.slice(-4)}`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{t('settings.apiKeys.title')}</h2>
          <p className="text-gray-600 mt-1">{t('settings.apiKeys.description')}</p>
        </div>
        <button
          onClick={() => setShowNewKey(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('settings.apiKeys.generate')}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {showNewKey && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={generateApiKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('settings.apiKeys.keyDescription')}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('settings.apiKeys.descriptionPlaceholder')}
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowNewKey(false);
                  setDescription('');
                  setNewKey(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {t('settings.apiKeys.generate')}
              </button>
            </div>
          </form>

          {newKey && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm break-all">{newKey}</div>
                <button
                  onClick={() => copyToClipboard(newKey)}
                  className="text-green-600 hover:text-green-700 ml-2"
                  title={t('settings.apiKeys.copy')}
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-green-600">
                {t('settings.apiKeys.saveKeyWarning')}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('settings.apiKeys.description')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('settings.apiKeys.key')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('settings.apiKeys.created')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('settings.apiKeys.status')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  {t('settings.apiKeys.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    {t('common.loading')}
                  </td>
                </tr>
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    {t('settings.apiKeys.noKeys')}
                  </td>
                </tr>
              ) : (
                apiKeys.map((key) => (
                  <tr key={key.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Key className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {key.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="font-mono text-sm text-gray-600">
                          {maskApiKey(key.key)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(key.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          key.revoked_at
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {key.revoked_at ? t('settings.apiKeys.revoked') : t('settings.apiKeys.active')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!key.revoked_at ? (
                        <button
                          onClick={() => revokeApiKey(key.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          {t('settings.apiKeys.revoke')}
                        </button>
                      ) : (
                        <button
                          onClick={() => deleteApiKey(key.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}