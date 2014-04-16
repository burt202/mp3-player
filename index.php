<?php

use Symfony\Component\HttpFoundation\Response;

#	AUTOLOADING

require 'vendor/autoload.php';

use Symfony\Component\ClassLoader\UniversalClassLoader;
use Twig\Loader\Filesystem;
use Silex\Application;
use Silex\Provider\ServiceControllerServiceProvider;
use App\App;

$loader = new UniversalClassLoader();

$loader->registerNamespaces(array(
	'App' => __DIR__ . '/server',
));

$loader->register();

#   CONFIG

$json = file_get_contents(__DIR__ . '/configs/app.json');
$config = json_decode($json, true);

#	TWIG

$loader = new Twig_Loader_Filesystem(__DIR__ . '/public/templates');
$twig = new Twig_Environment($loader);

#	SILEX

$app = new Application();
$app->register(new ServiceControllerServiceProvider());
$app['debug'] = true;

$app['app.controller'] = $app->share(function() use ($config, $twig) {
	return new App($config, $twig);
});

$app->get('/', 'app.controller:indexPage');

$app->error(function (\Exception $e, $code) {
    switch ($code) {
        case 404:
            $message = 'The requested page could not be found.';
            break;
        default:
            $message = 'We are sorry, but something went terribly wrong.';
    }

    return new Response($message);
});

$app->run();
