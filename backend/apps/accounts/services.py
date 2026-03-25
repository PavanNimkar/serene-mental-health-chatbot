# apps/accounts/services.py
import logging

logger = logging.getLogger('apps.accounts')


def handle_safety_alert(user):
    """
    Triggered when a user reports self-harm thoughts during onboarding.
    Extend this to send emails, notify admins, or queue a Celery task.
    """
    logger.critical(
        'SAFETY ALERT: User %s (id=%s) reported self-harm ideation during onboarding.',
        user.display_name or user.username,
        user.id,
    )
    # TODO: send_mail() to clinical team, push to alert queue, etc.
