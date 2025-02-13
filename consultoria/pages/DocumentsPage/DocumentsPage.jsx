import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../src/hooks/useData';
import { Loading } from '../../component/Loading';
import style from './Documents.module.css';
import pdf from '../../src/assets/pdf.png';
import edity from '../../src/assets/edity.png';
import excluir from '../../src/assets/delittt.png';
import home from '../../src/assets/home.png';
import { AiFillSetting } from 'react-icons/ai';
import Footer from '../../component/Footer';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const DocumentsPage = () => {
  const { ['data']: documents, loading, error, request } = useData();
  const [newPdf, setNewPdf] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocument, setEditedDocument] = useState(null);

  useEffect(() => {
    request('get', 'document', { withCredentials: true });
  }, [request]);

  const handleDeleteDocument = async (filename, event) => {
    event.stopPropagation(); // Evitar a propagação do evento para evitar recarregamento da página
    console.log(filename);
    try {
      // Fazer uma solicitação de exclusão ao backend
      await fetch(`document/${filename}`, {
        method: "DELETE",
        headers: {
          // "Content-Type": "application/json",
          // Incluir cabeçalhos de autenticação, se necessário
        },
      });

      // Atualizar a lista de documentos após a exclusão
      request("get", "document", { withCredentials: true });
    } catch (error) {
      console.error("Erro ao excluir documento:", error);
      // Lidar com o erro, se necessário
    }
    
  };

  const handleEditDocument = async (documentId, newData) => {
    try {
      await fetch(`document/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      request('get', 'document', { withCredentials: true });
      setIsEditing(false);
      setEditedDocument(null);
    } catch (error) {
      console.error('Erro ao editar documento:', error);
    }
  };

  const handleNewPdfUpload = async () => {
    if (!newPdf) return;

    try {
      const formData = new FormData();
      formData.append('pdf', newPdf);

      await fetch(`uploadPdf`, {
        method: 'POST',
        body: formData,
      });
      request('get', 'document', { withCredentials: true });
    } catch (error) {
      console.error('Erro ao enviar novo PDF:', error);
    }
  };

  const handleEditButtonClick = (document) => {
    setIsEditing(true);
    setEditedDocument({ ...document }); // Copia os dados do documento para editar
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedDocument(null);
  };

  const handleSaveEdit = async () => {
    if (!editedDocument) return;

    try {
      const newData = {
        name: editedDocument.name,
        type: editedDocument.type,
        client: editedDocument.client,
        emission: editedDocument.emission,
        validity: editedDocument.validity,
      };

      await handleEditDocument(editedDocument._id, newData);

      // Atualiza os estados para sair do modo de edição e limpar os dados do documento editado
      setIsEditing(false);
      setEditedDocument(null);
    } catch (error) {
      console.error('Erro ao salvar as alterações:', error);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setEditedDocument((prevDocument) => ({
      ...prevDocument,
      [fieldName]: value,
    }));
  };

  return (
    <div className={style.documentContainer}>
      {error && <h1>Não foi possível carregar os dados</h1>}
      {loading && <Loading />}
      {!loading && !error && (
        <>
          <Link className={style.homeButton} to="/home">
            <button>
              <img src={home} className={style.home} alt="" />
            </button>
          </Link>

          <section className={style.tableContent}>
            <table>
              <thead>
                <tr>
                  <th className={style.infos}>#</th>
                  <th className={style.infos}>Documento</th>
                  <th className={style.infos}>Tipo</th>
                  <th className={style.infos}>Empresa</th>
                  <th className={style.infos}>Emissão</th>
                  <th className={style.infos}>Vencimento</th>
                  <th className={style.infos}>
                    <AiFillSetting />
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document, index) => (
                  <tr key={document._id}>
                    <td>{index + 1}</td>
                    <td>
                      {isEditing && editedDocument?._id === document._id ? (
                        <input
                          type="text"
                          value={editedDocument.name}
                          onChange={(e) =>
                            handleInputChange('name', e.target.value)
                          }
                        />
                      ) : (
                        document.name
                      )}
                    </td>
                    <td>
                      {isEditing && editedDocument?._id === document._id ? (
                        <input
                          type="text"
                          value={editedDocument.type}
                          onChange={(e) =>
                            handleInputChange('type', e.target.value)
                          }
                        />
                      ) : (
                        document.type
                      )}
                    </td>
                    <td>
                      {isEditing && editedDocument?._id === document._id ? (
                        <input
                          type="text"
                          value={editedDocument.client}
                          onChange={(e) =>
                            handleInputChange('client', e.target.value)
                          }
                        />
                      ) : (
                        document.client
                      )}
                    </td>
                    <td>
                      {isEditing && editedDocument?._id === document._id ? (
                        <input
                          type="text"
                          value={formatDate(editedDocument.emission)}
                          onChange={(e) =>
                            handleInputChange('emission', e.target.value)
                          }
                        />
                      ) : (
                        formatDate(document.emission)
                      )}
                    </td>
                    <td>
                      {isEditing && editedDocument?._id === document._id ? (
                        <input
                          type="text"
                          value={formatDate(editedDocument.validity)}
                          onChange={(e) =>
                            handleInputChange('validity', e.target.value)
                          }
                        />
                      ) : (
                        formatDate(document.validity)
                      )}
                    </td>
                    <td>
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className={style.documentsIcons}
                          src={pdf}
                          alt=""
                        />
                      </a>
                      {!isEditing && (
                        <button
                          className={style.iconButton}
                          onClick={() => handleEditButtonClick(document)}
                        >
                          <img
                            className={style.documentsIcons}
                            src={edity}
                            alt=""
                          />
                        </button>
                      )}
                      <button
                        className={style.iconButton}
                        onClick={(event) =>
                          handleDeleteDocument(document.key, event)
                          
                        }
                      >
                        <img
                          className={style.documentsIcons}
                          src={excluir}
                          alt=""
                        />
                      </button>
                      {isEditing && editedDocument?._id === document._id && (
                        <button onClick={handleSaveEdit}>Salvar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {isEditing && editedDocument && (
            <>
              <button onClick={handleCancelEdit}>Cancelar</button>
            </>
          )}

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setNewPdf(e.target.files[0])}
          />
          <button onClick={handleNewPdfUpload}>Enviar Novo PDF</button>
        </>
      )}

      <Footer />
    </div>
  );
};

export default DocumentsPage;
