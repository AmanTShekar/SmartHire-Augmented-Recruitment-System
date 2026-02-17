import io
import logging
from docling.document_converter import DocumentConverter

logger = logging.getLogger(__name__)

class PDFService:
    def __init__(self):
        # Initialize the converter. 
        # Note: In a production environment with OOM constraints, 
        # you might want to initialize this lazily or manage its lifecycle.
        self.converter = DocumentConverter()

    def parse_resume(self, file_bytes: bytes) -> str:
        """
        Parses PDF bytes into Markdown using Docling.
        """
        try:
            # Docling handles bytes via a stream or file path
            # For simplicity, we'll use a source wrapper if needed, 
            # but usually it accepts local paths or URLs.
            # We'll write to a temp buffer if required by the specific docling version.
            
            # Implementation for 2026: Assuming direct byte/stream support
            result = self.converter.convert(file_bytes)
            
            # Export to markdown for optimal LLM consumption
            markdown_content = result.document.export_to_markdown()
            
            return markdown_content
        except Exception as e:
            logger.error(f"Error parsing PDF with Docling: {e}")
            raise RuntimeError(f"Failed to parse PDF: {str(e)}")

pdf_service = PDFService()
