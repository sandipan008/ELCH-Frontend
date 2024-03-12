function uploadFile() {
  // Get the input element for file selection
  const fileInput = document.getElementById('formFileMultiple');
  
  // Check if a file is selected
  if (fileInput.files.length === 0) {
    alert('Please select a file before uploading.');
    return;
  }

  // Create a FormData object to send the file as form data
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  // Define the API endpoint URL
  // const apiUrl = 'https://44.217.244.93:8089/fsc/upload';
  const apiUrl = 'http://localhost:8082/fsc/upload';

  // Send a POST request to the API
  fetch(apiUrl, {
    method: 'POST',
    body: formData,
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Upload failed.');
      }
    })
    .then(data => {
      // Handle the API response here if needed
      console.log('File upload successful:', data);
      // Handle the JSON data here
        const success__uploadData = document.querySelector(".success__uplaodData");
        success__uploadData.style.display = "flex";
        success__uploadData.innerHTML = `Sucessful Records: ${data.sucessful_Records} \n 
        duplicate_Records: ${data.duplicate_Records} \n
        failed_Records: ${data.failed_Records} \n
        total_No_Records: ${data.total_No_Records} \n
        duplicate_Records: ${data.duplicate_Records}`;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Add an event listener to the form for the submit button
document.getElementById('formAddUsers').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission behavior
  uploadFile(); // Call the uploadFile function
});
