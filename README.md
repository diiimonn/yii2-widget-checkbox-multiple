# yii2-widget-checkbox-multiple
Input widget to render multiple select box. Using jQuery ajax.

## Installation

To install with composer:

```
$ php composer.phar require diiimonn/yii2-widget-checkbox-multiple "dev-master"
```

or add

```
"diiimonn/yii2-widget-checkbox-multiple": "dev-master"
```

to the ```require``` section of your `composer.json` file.

## Usage

### view:
```php
...
use diiimonn\widgets\CheckboxMultiple;
use yii\helpers\Url;
...

<?= $form->field($model, 'books')->widget(CheckboxMultiple::className(), [
    'dataAttribute' => 'name',
    'scriptOptions' => [
        'ajax' => [
            'url' => Url::toRoute(['books']),
        ],
    ],
    'placeholder' => Yii::t('app', 'Select ...'),
]) ?>
```
or not use ActiveForm
```php
...
use diiimonn\widgets\CheckboxMultiple;
use yii\helpers\Url;
...

<?= CheckboxMultiple::widget([
    'model' => $model,
    'attribute' => 'books',
    'dataAttribute' => 'name',
    'scriptOptions' => [
        'ajax' => [
            'url' => Url::toRoute(['books']),
        ],
    ],
    'placeholder' => Yii::t('app', 'Select ...'),
]) ?>
```

### Settings
* data : array the select option data items. The array keys are option values, and the array values are the corresponding option labels. If not set this option the 'attribute' will be relation name.
* dataAttribute : string attribute name in relation models if not set 'data'.
* scriptOptions : array options for customize script settings.
* placeholder : string
* options : array options for widget tag.
* spinnerOptions : array options for [yii2-widget-spinner-canvas](https://github.com/diiimonn/yii2-widget-spinner-canvas).

### scriptOptions
* templateItem : string, html
* templateCheckbox : string, html
* templateResultItem : string, html
* templateInput : string, html
* templateResultError : string, html
* templateResultWarning : string, html
* templatePlaceholder : string, html
* warningMessage : string
* errorMessage : string
* defaultCheckbox :: boolean If 'true' and not selected items will be selected checkbox with empty value. Default 'true'.
* limit : integer Max count selected items.
* slimScroll : array
* wait : integer Time out in millisecond before ajax request.

### Customize scriptOptions example
```php
...
'scriptOptions' => [
    'defaultCheckbox' => false,
    'limit' => 10,
    'templateItem' => Html::tag('li', Html::tag('span', '{text}') .
            Html::tag('span', Html::tag('span', '', [
                'class' => 'glyphicon glyphicon-remove',
            ]), [
                'class' => 'checkbox-multiple-remove-item',
            ]), [
                'class' => 'checkbox-multiple-item',
            ]),
    'templateInput' => Html::textInput('checkbox-multiple-input', '', [
            'class' => 'form-control input-sm',
        ]),
    'slimScroll' => [
        'color' => '#333',
        'railOpacity' => 0.5,
        'railColor' => '#666666',
    ],
],
```