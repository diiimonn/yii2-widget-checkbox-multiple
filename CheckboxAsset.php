<?php
namespace diiimonn\checkbox;

use yii\web\AssetBundle;

/**
 * Class CheckboxAsset
 * @package diiimonn\checkbox
 */
class CheckboxAsset extends AssetBundle
{
    public $sourcePath = '@vendor/diiimonn/yii2-widget-checkbox-multiple/assets';

    public $depends = [
        'diiimonn\spinner\SpinnerAsset'
    ];

    public $js = [
        'js/checkbox.multiple.js'
    ];

    public $css = [
        'css/checkbox.multiple.css'
    ];
}
