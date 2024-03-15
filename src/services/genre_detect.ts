interface Genre {
    name: string;
    description?: string;
}

interface SubGenre {
    name: string;
}

const genres: Genre[] = [
    { name: 'Rock', description: 'Amped Anthems - A mix of high-voltage rock genres to amplify your energy' },
    { name: 'Hip-hop/Rap', description: 'Urban Pulse - Hip-hop beats from the streets' },
    { name: 'Electronic Dance Music (EDM)', description: 'Electric Rush - High-octane tunes to fuel the adrenaline pump' },
    { name: 'Country', description: 'Classic Country - Country tunes that take you down memory lane' },
    { name: 'Jazz', description: 'Swing & Smooth - Where Rhythms Dance and Melodies Flow' },
    { name: 'Classical', description: 'Timeless Harmonies - Elegance in Every Note' },
    { name: 'R&B/Soul', description: 'Soulful - A deep dive into the heart of music that stirs the soul' },
    { name: 'Indie/Alternative', description: 'Chillscapes - Drift off on a cloud of laid-back rhythms' },
    { name: 'Latin', description: 'Fiesta Beats - A colorful cocktail of Latin genres' },
    { name: 'Pop', description: 'Pop Pulse - Dance Vibes to blow your mind' },
];

const subGenres: SubGenre[] = [
    { name: 'Indie Pop' },
    { name: 'K-Pop' },
    { name: 'Latin Pop' },
    { name: 'Classic Rock' },
    { name: 'Alternative Rock' },
    { name: 'Indie Rock' },
    { name: 'Hard Rock' },
    { name: 'Punk Rock' },
    { name: 'Heavy Metal' },
    { name: 'Folk Rock' },
    { name: 'Gangsta Rap' },
    { name: 'Trap' },
    { name: 'Mumble Rap' },
    { name: 'East Coast/West Coast Hip Hop' },
    { name: 'Conscious Hip Hop' },
    { name: 'Old School Hip Hop' },
    { name: 'Alternative Hip Hop' },
    { name: 'House' },
    { name: 'Techno' },
    { name: 'Trance' },
    { name: 'Drum and Bass' },
    { name: 'Dubstep' },
    { name: 'Trap EDM' },
    { name: 'Hardstyle' },
    { name: 'Classic Country' },
    { name: 'Pop Country' },
    { name: 'Bluegrass' },
    { name: 'Outlaw Country' },
    { name: 'Alternative Country' },
    { name: 'Country Rock' },
    { name: 'Americana' },
    { name: 'Swing' },
    { name: 'Bebop' },
    { name: 'Fusion' },
    { name: 'Smooth Jazz' },
    { name: 'Free Jazz' },
    { name: 'Acid Jazz' },
    { name: 'Modal Jazz' },
    { name: 'Baroque' },
    { name: 'Romantic' },
    { name: 'Modern' },
    { name: 'Contemporary' },
    { name: 'Chamber Music' },
    { name: 'Opera' },
    { name: 'Choral' },
    { name: 'Contemporary R&B' },
    { name: 'Funk' },
    { name: 'Soul' },
    { name: 'Neo-Soul' },
    { name: 'Psychedelic Soul' },
    { name: 'Motown' },
    { name: 'Quiet Storm' },
    { name: 'Indie Rock' },
    { name: 'Indie Pop' },
    { name: 'Lo-fi' },
    { name: 'Alternative Rock' },
    { name: 'Shoegaze' },
    { name: 'Dream Pop' },
    { name: 'Chillwave' },
    { name: 'Reggaeton' },
    { name: 'Latin Trap' },
    { name: 'Bachata' },
    { name: 'Salsa' },
    { name: 'Cumbia' },
    { name: 'Latin Pop' },
    { name: 'Latin Ballad' },
    { name: 'Teen Pop' },
    { name: 'Pop Rock' },
    { name: 'Pop Rap' },
    { name: 'Electro Pop' }
];


const matchGenre = (primaryGenre: string): string | null => {
    const genreRegex = new RegExp(`^${primaryGenre}$`, 'i');
    const matchedGenre = genres.find((genre) => genreRegex.test(genre.name));
    if (matchedGenre) {
        return matchedGenre.name;
    }

    const subGenreRegex = new RegExp(`^${primaryGenre}$`, 'i');
    const matchedSubGenre = subGenres.find((subGenre) => subGenreRegex.test(subGenre.name));
    if (matchedSubGenre) {
        return matchedSubGenre.name;
    }

    return null;
}

export default matchGenre;