<?php

use craft\elements\Entry;
use League\Fractal\TransformerAbstract;

/**
 * Class LVAdapter
 *
 * LVAdaptor organizes Live Vue calls element-api endpoints may need.
 * All of its methods are static, and it's not 'used' from the plugin, because
 * element-api should continue to operate when the plugin's not installed
 */
class LVAdapter
{
    /**
     * criteria is the standard Live Vue criteria handler. It has to be outside the plugin
     * because criteria need to act normally if you choose to disable or uninstall the plugin
     *
     * @param null $localCriteria
     * @return array
     */
    static function criteria($localCriteria = null)
    {
        $liveVuePlugin = self::getLVPlugin();

        $criteria = $liveVuePlugin
            ? $liveVuePlugin->setCriteraAndAccess($localCriteria)
            : $localCriteria;

        return $criteria;
    }

    /**
     * This will set CORS header according to config/live-vue.php allowedOrigins
     */
    static function setCorsAccess()
    {
        $liveVuePlugin = self::getLVPlugin();

        if ($liveVuePlugin) {
            $liveVuePlugin->getSources()->arrangeAccess();
        }
    }

    /**
     * @return array
     */
    static function hiddenIds()
    {
        $liveVuePlugin = self::getLVPlugin();

        return $liveVuePlugin
            ? $liveVuePlugin->currentHiddenIds()
            : [];
    }

    static function getLVPlugin()
    {
        return Craft::$app->getPlugins()->getPlugin('live-vue');
    }
}

function _navItem($card, $hiddenIds)
{

    $out = [
        'title' => $card->title,
        'id' => $card->id,
        'uri' => $card->uri,
        'url' => $card->url,
        'children' => [],
    ];

    if ($card->hasDescendants) {
        foreach ($card->children as $child) {
            if (!in_array($child->id, $hiddenIds)) { // $plugin->currentHiddenids()
                array_push($out['children'], _navItem($child, $hiddenIds));
            }
        }
    }

    return $out;
}

function _getNav()
{
    $hiddenIds = LVAdapter::hiddenIds();

    $cards = Entry::find()
        ->section('cards')
        ->where(['not in', 'elements.id', $hiddenIds])
        ->level(1)// just the top
        ->all();

    $output = [];

    foreach ($cards as $card) {
        array_push($output, _navItem($card, $hiddenIds));
    }

    return $output;
}

/**
 * @param array $criteria
 * @return array
 */
function _getCards (array $criteria)
{
    return [
        'elementType' => Entry::class,
        'criteria' => $criteria,
        'one' => false,
        'paginate' => false,
        'transformer' => function(Entry $entry) {

            $theImages = $entry->image->all();
            $images = [];
            foreach ($theImages as $image) {
                $images[] = [
                    'id' => $image->id,
                    'title' => $image->title,
                    'url' => $image->getUrl('cardImage'),
                ];
            }
            return [
                'title' => $entry->title,
                'body' => [
                    'content' => $entry->body,
                ],
                'image' => $images
            ];
        }
    ];
}


return [
    'defaults' => [
        'transformer' => function(Entry $entry) {
            return [
                'title' => $entry->title,
                'id' => $entry->id,
                'url' => $entry->url,
            ];
        },
    ],
    'endpoints' => [
        'api/cards/?<cardUri:([\w\/\-]+)>.json' => function($cardUri) {

            // As in this endpoint, with a match param, be sure it and
            // the function variable are spelled exactly the same.

            // for an open endpoint, so browser js can call it
            LVAdapter::setCorsAccess();

            // n.b. when section is multi-word, then it is the same snake-case here,
            // but must be camelCase in the endPoint signature capturing it above...

            $uri = 'cards/' . $cardUri;

            $criteria = LVAdapter::criteria([
                'section' => 'cards',
                'uri' => $uri,
                'orderBy' => 'postDate asc',
            ]);

            return _getCards($criteria);
        },
        'api/cards.json' => function() {

            // for an open endpoint, so browser js can call it
            LVAdapter::setCorsAccess();

            $criteria = LVAdapter::criteria([
                'section' => 'cards',
                'orderBy' => 'postDate asc',
            ]);

            return _getCards($criteria);
        },
        'api/nav.json' => function() {

            LVAdapter::setCorsAccess();
            $wait = null;
            $criteria = [];

            return [
                'elementType' => Entry::class,
                'criteria' => $criteria,
                'one' => true,
                'transformer' => function(Entry $entry) {
                    return [
                        'nav' => _getNav(),
                    ];
                }
            ];
        }
    ]
];
