import React, { useEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

const PDFManipulator = ({ pdfUrl, onSuccess }) => {
  const imageUrl = 'http://localhost:3000/pdfs/printlogo.jpg'; // JPG Image URL

  useEffect(() => {
    const manipulatePDF = async () => {
      try {
        console.log('Fetching PDF from:', pdfUrl); // Debug log for PDF URL

        // Fetch the existing PDF
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        const existingPdfBytes = await response.arrayBuffer();

        console.log('PDF successfully fetched'); // Debug log for successful fetch

        // Load the PDF
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        console.log('PDF loaded'); // Debug log for PDF loading

        // Fetch the JPG image
        const imgResponse = await fetch(imageUrl);
        if (!imgResponse.ok) {
          throw new Error('Failed to fetch image');
        }
        const imgBytes = await imgResponse.arrayBuffer();

        console.log('JPG image successfully fetched'); // Debug log for image fetch

        // Embed the JPG image
        const jpgImage = await pdfDoc.embedJpg(imgBytes);

        console.log('JPG image embedded in PDF'); // Debug log for image embedding

        // Function to apply changes to a page
        const applyChangesToPage = (page) => {
          // Get image dimensions
          const { width, height } = jpgImage.scale(0.8); // Scale down to 80% of the original size

          // Draw a horizontal line below the image and text
          const lineYTop = page.getHeight() - height - 52;
          page.drawLine({
            start: { x: 110, y: lineYTop }, // Start at the left
            end: { x: page.getWidth() - 110, y: lineYTop }, // End at the right with 10 units padding
            thickness: 1, // Line thickness
            color: rgb(0, 0, 0), // Black color for the line
          });

          // Place the image at the start of the top line
          page.drawImage(jpgImage, {
            x: 110, // Start at the left, aligned with the line
            y: lineYTop + 10, // Slightly above the line (10 units)
            width,
            height,
          });

          // Format the current date and time
          const currentDate = new Date();
          const formattedDate = currentDate.toLocaleDateString('en-US', {
            weekday: 'short',   // Day in short form (e.g., "Mon")
            day: '2-digit',     // Day as 2-digit number (e.g., "04")
            month: 'short',     // Month in short form (e.g., "Sep")
            year: 'numeric'     // Full year (e.g., "2023")
          });
          const formattedTime = currentDate.toLocaleTimeString('en-US', {
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true       // 12-hour format with AM/PM
          });
          const fullFormattedDate = `${formattedDate} - ${formattedTime}`;

          // Draw the formatted date and time on the right
          page.drawText(fullFormattedDate, {
            x: page.getWidth() - 234, // Align text on the right
            y: page.getHeight() - 80, // Same height as the image but to the right
            size: 9,
            color: rgb(0, 0, 0), // Black color for date and time
          });

          // Draw a second horizontal line just above the copyright text
          const lineYBottom = 60; // Distance from the bottom of the page
          page.drawLine({
            start: { x: 110, y: lineYBottom }, // Start at the left with 10 units padding
            end: { x: page.getWidth() - 110, y: lineYBottom }, // End at the right with 10 units padding
            thickness: 1, // Line thickness
            color: rgb(0, 0, 0), // Black color for the line
          });

          // Draw the sentence "Licensed to Yasir Hussain" at the left top of the bottom line
          const licenseText = 'Licensed to Yasir Hussain';
          page.drawText(licenseText, {
            x: 110, // Align text with the left of the bottom line
            y: lineYBottom + 10, // Slightly above the bottom line (10 units)
            size: 9,
            color: rgb(0, 0, 0), // Black color for the text
          });

          // Draw the copyright text centered below the line
          const copyrightText = 'Copyright © Andhra Legal Decisions';
          page.drawText(copyrightText, {
            x: (page.getWidth() - 150) / 2, // Center the text horizontally
            y: lineYBottom - 10, // Place text 10 units below the line
            size: 9,
            color: rgb(0, 0, 0), // Black color for the text
          });
        };

        // Apply changes to all pages
        const pages = pdfDoc.getPages();
        pages.forEach(page => applyChangesToPage(page));

        // Serialize the PDFDocument to bytes
        const pdfBytes = await pdfDoc.save();

        console.log('PDF manipulated and saved'); // Debug log for PDF manipulation

        // Create a Blob from the PDF bytes
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        // Create a Blob URL
        const url = URL.createObjectURL(blob);

        // Open the manipulated PDF in a new tab
        window.open(url);

        console.log('PDF opened in a new tab'); // Debug log for opening the PDF

        // Revoke the object URL to free memory when no longer needed
        URL.revokeObjectURL(url);

        // Call the success callback
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error manipulating PDF:', error); // Improved error logging
      }
    };

    if (pdfUrl) {
      manipulatePDF();
    }
  }, [pdfUrl, onSuccess]);

  return null; // This component does not render anything
};

export default PDFManipulator;
