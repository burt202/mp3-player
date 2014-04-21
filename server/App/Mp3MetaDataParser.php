<?php

namespace App;

use getID3;

class Mp3MetaDataParser
{
	protected $config;
	protected $twig;

	public function __construct($config, $twig)
	{
		$this->config = $config;
		$this->twig = $twig;

		$this->getID3 = new getID3();
	}

	public function parseFilesInDirectory ($dir)
	{
		$handle = opendir($dir);
		$fileArray = array();
		$count = 1;

		while (false !== ($fileName = readdir($handle))) {
			$extension = strtolower(substr(strrchr($fileName, '.'), 1));

			if ($extension != 'mp3') {
				continue;
			}

			$metaData = $this->getMetaDataForFile($dir . '/' . $fileName);
			$metaData['id'] = $count;

			$fileArray[] = $metaData;
			$count++;
		}

		return $this->sortByArtistThenAlbum($fileArray);
	}

	private function getMetaDataForFile ($filePath)
	{
		$metaData = $this->getID3->analyze($filePath);

		$artist = '';
		if (isset($metaData['tags']['id3v2']['artist'][0])) {
			$artist = htmlspecialchars($metaData['tags']['id3v2']['artist'][0]);
		}

		$title = '';
		if (isset($metaData['tags']['id3v2']['title'][0])) {
			$title = htmlspecialchars($metaData['tags']['id3v2']['title'][0]);
		}

		$album = '';
		if (isset($metaData['tags']['id3v2']['album'][0])) {
			$album = htmlspecialchars($metaData['tags']['id3v2']['album'][0]);
		}

		$genre = '';
		if (isset($metaData['tags']['id3v2']['genre'][0])) {
			$genre = htmlspecialchars($metaData['tags']['id3v2']['genre'][0]);
		}

		$year = '';
		if (isset($metaData['tags']['id3v2']['year'][0])) {
			$year = htmlspecialchars($metaData['tags']['id3v2']['year'][0]);
		}

		return array(
			'artist' => $artist,
			'title' => $title,
			'album' => $album,
			'genre' => $genre,
			'year' => $year,
			'length' => round($metaData['playtime_seconds']),
			'bitrate' => $metaData['bitrate'] / 1000,
			'size' => $metaData['filesize'],
			'path' => $filePath
		);
	}

	private function sortByArtistThenAlbum ($fileArray) {
		$artist = array();
		$albums = array();

		foreach ($fileArray as $key => $value) {
		    $artists[$key]  = $value['artist'];
		    $albums[$key] = $value['album'];
		}

		array_multisort($artists, SORT_ASC, $albums, SORT_ASC, $fileArray);

		return $fileArray;
	}
}
