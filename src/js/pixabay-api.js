const KEY = '42555164-0de9ae952fe9eb05e418ffbde';

export async function fetchImages(query, page = 1, perPage = 15) {
  const url = `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    
    if (data.hits.length === 0) {
      throw new Error('No images found');
    }

    return { totalHits: data.totalHits, images: data.hits };
  } catch (error) {
    throw error;
  }
}
