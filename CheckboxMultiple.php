<?php
namespace diiimonn\widgets;

use Yii;
use yii\base\Widget;
use yii\db\Exception;
use yii\base\InvalidConfigException;
use yii\db\ActiveRecord;
use yii\helpers\Json;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;

/**
 * Class CheckboxMultiple
 * @package diiimonn\widgets
 */
class CheckboxMultiple extends Widget
{
    /**
     * @var ActiveRecord
     */
    public $model;

    /**
     * Relation name
     * @var string
     */
    public $attribute = '';

    public $scriptOptions = [];

    public $attributeLabel = '';

    public $templateItem = '';

    public $placeholder = '';

    public $options = [];

    public $spinnerOptions = [];

    /**
     * @var array
     */
    public $data;

    /**
     * @var CheckboxMultipleAsset
     */
    protected $asset;

    public function init()
    {
        parent::init();

        if (!$this->hasModel() ||
            (!isset($this->model->{$this->attribute}) && !is_null($this->model->{$this->attribute})) ||
            empty($this->attributeLabel)) {
            throw new InvalidConfigException("Either 'model' and 'attribute' and 'attributeLabel' properties must be specified.");
        }

        $this->asset = CheckboxMultipleAsset::register($this->getView());

        /** @var ActiveRecord[] $models */
        if (!$this->data && $models = $this->model->{$this->attribute}) {
            $primaryKey = $models[0]->primaryKey();

            if (!isset($primaryKey[0])) {
                throw new Exception('"' . get_class($models[0]) . '" must have a primary key.');
            }

            $this->data = ArrayHelper::map($models, $primaryKey[0], $this->attributeLabel);
        }

        $this->scriptOptions['data'] = $this->data;

        if (!isset($this->scriptOptions['templateItem']) || !$this->scriptOptions['templateItem']) {
            $this->scriptOptions['templateItem'] = Html::tag('li', '{text}' . Html::a(Html::tag('span', '', [
                    'class' => 'glyphicon glyphicon-remove'
                ]), '#', [
                    'class' => 'checkbox-multiple-remove-item',
                    'onclick' => 'return false;'
                ]), [
                    'class' => 'checkbox-multiple-item'
                ]);
        }

        if (!isset($this->scriptOptions['templateCheckbox']) || !$this->scriptOptions['templateCheckbox']) {
            $this->scriptOptions['templateCheckbox'] = Html::checkbox($this->model->formName() . '[' . $this->attribute . '][]', true, [
                'value' => '{id}'
            ]);
        }

        if (!isset($this->scriptOptions['templateResultItem']) || !$this->scriptOptions['templateResultItem']) {
            $this->scriptOptions['templateResultItem'] = Html::tag('li', '{text}', [
                'class' => 'checkbox-multiple-result-item'
            ]);
        }

        if (!isset($this->scriptOptions['templateInput']) || !$this->scriptOptions['templateInput']) {
            $this->scriptOptions['templateInput'] = Html::textInput('checkbox-multiple-input', '', [
                'class' => 'form-control'
            ]);
        }

        if (!isset($this->scriptOptions['errorMessage'])) {
            $this->scriptOptions['errorMessage'] = Yii::t('app', 'Error');
        }

        if (!isset($this->scriptOptions['templateResultError']) || !$this->scriptOptions['templateResultError']) {
            $this->scriptOptions['templateResultError'] = Html::tag('li', '{text}', [
                'class' => 'checkbox-multiple-result-error'
            ]);
        }

        if (!isset($this->scriptOptions['warningMessage'])) {
            $this->scriptOptions['warningMessage'] = Yii::t('app', 'No results');
        }

        if (!isset($this->scriptOptions['templateResultWarning']) || !$this->scriptOptions['templateResultWarning']) {
            $this->scriptOptions['templateResultWarning'] = Html::tag('li', '{text}', [
                'class' => 'checkbox-multiple-result-warning'
            ]);
        }

        if (empty($this->placeholder)) {
            $this->placeholder = Yii::t('app', 'Search ...');
        }

        $this->scriptOptions['templatePlaceholder'] = Html::tag('li', $this->placeholder, [
            'class' => 'checkbox-multiple-placeholder'
        ]);

        Html::addCssClass($this->options, 'checkbox-multiple');
    }

    public function run()
    {
        $this->registerClientScript();

        $sections = [
            Html::tag('ul', '', [
                'class' => 'checkbox-multiple-items-section'
            ]),
            Html::tag('div', implode("\n", [
                Html::tag('div', Spinner::widget($this->spinnerOptions), [
                    'class' => 'checkbox-multiple-input-section'
                ]),
                Html::tag('div', Html::tag('ul', '', [
                    'class' => 'checkbox-multiple-result list-unstyled'
                ]), [
                    'class' => 'checkbox-multiple-result-section'
                ]),
            ]), [
                'class' => 'checkbox-multiple-search'
            ]),
            Html::tag('div', '', [
                'class' => 'checkbox-multiple-checkbox-section'
            ]),
        ];

        $this->options['id'] = $this->id;

        return Html::tag('div', implode("\n", $sections), $this->options) . Html::tag('div', '', ['style' => 'clear: both;']);
    }

    public function registerClientScript()
    {
        $js = 'jQuery("#' . $this->id . '").checkboxMultiple(' . Json::encode($this->scriptOptions) . ');';
        $view = $this->getView();
        $view->registerJs($js);
    }

    public function hasModel()
    {
        return $this->model instanceof ActiveRecord;
    }
}
