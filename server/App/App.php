<?php

namespace App;

use Symfony\Component\HttpFoundation\Request;
use getID3;

class App
{
	protected $config;
	protected $twig;

	public function __construct($config, $twig)
	{
		$this->config = $config;
		$this->twig = $twig;
	}

	public function indexPage (Request $request)
	{
		$mp3s = $this->getFileList();
		$urlOverride = false;
		$urlVars = array_flip($request->query->keys());

		if (isset($urlVars['rawAssets'])) {
			$urlOverride = true;
		}

		return $this->twig->render('layout.html', array(
			'envType' => $this->config['type'],
			'mp3s' => $mp3s,
			'urlOverride' => $urlOverride
		));
	}

	private function getFileList ()
	{
		$getID3 = new getID3();

		$dir = 'mp3s';
		$handle = opendir($dir);

		$fileArray = array();

		#	LOOP THROUGH FILES AND BUILD PHP ARRAY

		$count = 1;

		while (false !== ($fileName = readdir($handle))) {
			$extension = strtolower(substr(strrchr($fileName, '.'), 1));

			if ($extension != 'mp3') {
				continue;
			}

			$fileInfo = $getID3->analyze($dir . '/' . $fileName);

			$artist = '';
			$title = '';
			$album = '';
			$genre = '';
			$year = '';

			if (isset($fileInfo['tags']['id3v2']['artist'][0])) {
				$artist = htmlspecialchars($fileInfo['tags']['id3v2']['artist'][0]);
			}

			if (isset($fileInfo['tags']['id3v2']['title'][0])) {
				$title = htmlspecialchars($fileInfo['tags']['id3v2']['title'][0]);
			}

			if (isset($fileInfo['tags']['id3v2']['album'][0])) {
				$album = htmlspecialchars($fileInfo['tags']['id3v2']['album'][0]);
			}

			if (isset($fileInfo['tags']['id3v2']['genre'][0])) {
				$genre = htmlspecialchars($fileInfo['tags']['id3v2']['genre'][0]);
			}

			if (isset($fileInfo['tags']['id3v2']['year'][0])) {
				$year = htmlspecialchars($fileInfo['tags']['id3v2']['year'][0]);
			}

			$length = $fileInfo['playtime_string'];
			$bitrate = $fileInfo['bitrate'] / 1000 . 'kbps';
			$size = round(($fileInfo['filesize'] / 1024) / 1024, 1) . 'mb';

			$path = $dir . '/' . $fileName;

			$fileArray[] = array('id' => $count, 'artist'=>$artist, 'title'=>$title, 'album'=>$album, 'genre'=>$genre, 'year'=>$year, 'length'=>$length, 'bitrate'=>$bitrate, 'size'=>$size, 'path'=>$path);

			$count++;
		}

		#	SORT ARRAY BY ARTIST AND THEN ALBUM

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
