<?php

namespace App;

use Symfony\Component\HttpFoundation\Request;
use App\Mp3MetaDataParser;

class App
{
	protected $config;
	protected $twig;

	public function __construct($config, $twig)
	{
		$this->config = $config;
		$this->twig = $twig;

		$this->mp3MetaDataParser = new Mp3MetaDataParser();
	}

	public function indexPage (Request $request)
	{
		$mp3MetaData = $this->mp3MetaDataParser->parseFilesInDirectory($this->config['directoryPath']);
		$urlOverride = false;
		$urlVars = array_flip($request->query->keys());

		if (isset($urlVars['rawAssets'])) {
			$urlOverride = true;
		}

		return $this->twig->render('layout.html', array(
			'envType' => $this->config['type'],
			'mp3s' => $mp3MetaData,
			'urlOverride' => $urlOverride
		));
	}
}
