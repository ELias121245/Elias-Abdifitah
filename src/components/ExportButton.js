import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TodoPDF from './TodoPDF';

const ExportButton = ({ todos, stats }) => {
  return (
    <div className="export-button-container">
      <PDFDownloadLink
        document={<TodoPDF todos={todos} stats={stats} />}
        fileName={`todo-list-${new Date().toISOString().split('T')[0]}.pdf`}
      >
        {({ blob, url, loading, error }) => (
          <button className="export-button" disabled={loading}>
            {loading ? 'Generating PDF...' : 'Export to PDF'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default ExportButton;
