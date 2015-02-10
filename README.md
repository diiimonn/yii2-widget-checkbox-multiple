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
or not used ActiveForm
```php
...
use diiimonn\widgets\CheckboxMultiple;
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
* scriptOptions : array options for customize script settings. Customize templates: 'templateItem', 'templateCheckbox', 'templateResultItem', 'templateInput', 'templateResultError', 'templateResultWarning', 'templatePlaceholder'. Customize messages: 'warningMessage', 'errorMessage'.
* placeholder : string
* options : array options for widget tag.
* spinnerOptions : array options for [yii2-widget-spinner-canvas](https://github.com/diiimonn/yii2-widget-spinner-canvas).