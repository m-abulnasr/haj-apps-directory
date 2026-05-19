from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0006_fix_arabic_category_names'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='name_ur',
            field=models.CharField(
                blank=True,
                db_index=True,
                help_text="Category name in Urdu",
                max_length=100,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name='category',
            name='description_ur',
            field=models.TextField(
                blank=True,
                help_text="Category description in Urdu",
                null=True,
            ),
        ),
    ]
