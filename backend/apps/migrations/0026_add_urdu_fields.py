# Schema migration to add Urdu language fields to App model and AppScreenshot

from django.db import migrations, models
import apps.validators
import core.storage.r2_storage


def main_image_ur_upload_path(instance, filename):
    """
    Generate upload path for Urdu main images.

    Args:
        instance: App model instance
        filename: Original filename

    Returns:
        Path like 'app-images/app-slug/main_ur.webp'
    """
    # Always use .webp since we convert images
    slug = instance.slug or 'unknown'
    return f"app-images/{slug}/main_ur.webp"


class Migration(migrations.Migration):

    dependencies = [
        ('apps', '0025_populate_app_metadata'),
    ]

    operations = [
        # --- App model: new Urdu fields ---
        migrations.AddField(
            model_name='app',
            name='name_ur',
            field=models.CharField(
                blank=True,
                db_index=True,
                help_text="App name in Urdu",
                max_length=200,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name='app',
            name='short_description_ur',
            field=models.TextField(
                blank=True,
                help_text="Short description in Urdu",
                null=True,
            ),
        ),
        migrations.AddField(
            model_name='app',
            name='description_ur',
            field=models.TextField(
                blank=True,
                help_text="Full description in Urdu",
                null=True,
            ),
        ),
        migrations.AddField(
            model_name='app',
            name='main_image_ur',
            field=models.ImageField(
                blank=True,
                help_text="Main cover image - Urdu (PNG, JPG, WebP, max 5MB)",
                max_length=500,
                null=True,
                storage=core.storage.r2_storage.R2Storage(),
                upload_to=main_image_ur_upload_path,
                validators=[apps.validators.validate_image_file],
            ),
        ),
        # --- AppScreenshot: add Urdu to language choices ---
        migrations.AlterField(
            model_name='appscreenshot',
            name='language',
            field=models.CharField(
                choices=[('en', 'English'), ('ar', 'Arabic'), ('ur', 'Urdu')],
                db_index=True,
                default='en',
                help_text="Language of the screenshot",
                max_length=2,
            ),
        ),
    ]
