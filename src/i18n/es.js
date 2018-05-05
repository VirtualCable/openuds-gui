

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    var v=(n != 1);
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "(filtered from _MAX_ total records)": "(registros filtrados de un total de _MAX_)", 
    "(no days)": "(sin d\u00edas)", 
    "Accept": "Aceptar", 
    "Access calendar removal error": "Error en el borrado del calendario de acceso", 
    "Active": "Activo", 
    "Add": "A\u00f1adir", 
    "Add access calendar": "A\u00f1adir calendario de acceso", 
    "Add group": "Agregar grupo", 
    "Add scheduled action": "A\u00f1adir acci\u00f3n programada", 
    "Add transport": "A\u00f1adir transporte", 
    "April": "Abril", 
    "Are you sure do you want to delete ": "\u00bfEst\u00e1s seguro de que lo quieres eliminar?", 
    "August": "Agosto", 
    "Authenticator creation error": "Error al crear autenticador", 
    "Authenticator deletion error": "Error al eliminar autenticador", 
    "Authenticator saving error": "Error al guardar autenticador", 
    "Beginning": "Inicio", 
    "Cache": "Cach\u00e9", 
    "Cache has been flushed": "La cach\u00e9 se ha vaciado", 
    "Calendar creation error": "Error de creaci\u00f3n de calendario", 
    "Calendar deletion error": "Error de eliminaci\u00f3n de calendario", 
    "Calendar saving error": "Error guardando calendario", 
    "Cancel": "Cancelar", 
    "Cancel publication?": "\u00bfCancelar la publicaci\u00f3n?", 
    "Click on a row to select it": "Haga clic en una fila para seleccionarla", 
    "Close": "Cerrar", 
    "Configuration saved": "Configuraci\u00f3n guardada", 
    "Confirm revocation of following permissions: <br/>": "Confirmar la revocaci\u00f3n de los permisos siguientes: <br/>", 
    "Connection failed": "Conexi\u00f3n fallida", 
    "Contacting service...": "Contactando con servicio...", 
    "Creation successfully done": "Creaci\u00f3n realizada con \u00e9xito", 
    "Daily": "Diario", 
    "Date": "Fecha", 
    "Days": "D\u00edas", 
    "December": "Diciembre", 
    "Default fallback access": "Acceso predeterminado", 
    "Delete": "Borrar", 
    "Delete Image": "Borrar imagen", 
    "Delete OSManager": "Eliminar OS Manager", 
    "Delete Services Pool Group": "Borrar grupo para Services Pool", 
    "Delete authenticator": "Eliminar autenticador", 
    "Delete calendar": "Eliminar calendario", 
    "Delete group": "Borrar grupo", 
    "Delete network": "Eliminar red", 
    "Delete rule": "Eliminar regla", 
    "Delete service": "Eliminar servicio", 
    "Delete services provider": "Eliminar proveedor de servicios", 
    "Delete transport": "Eliminar transporte", 
    "Delete user": "Eliminar usuario", 
    "Delete user service": "Eliminar servicio de usuario", 
    "Deletion error": "Error de eliminaci\u00f3n", 
    "Deletion results": "Resultados de la eliminaci\u00f3n", 
    "Edit": "Editar", 
    "Edit OSManager": "Editar OS Manager", 
    "Edit Services Pool Group": "Editar grupo para Services Pool", 
    "Edit access calendar": "Editar calendario de acceso", 
    "Edit authenticator": "Editar autenticador", 
    "Edit calendar": "Editar calendario", 
    "Edit group": "Editar grupo", 
    "Edit image": "Editar imagen", 
    "Edit network": "Editar red", 
    "Edit rule": "Editar regla", 
    "Edit service": "Editar servicio", 
    "Edit services provider": "Editar proveedor de servicios", 
    "Edit transport": "Editar transporte", 
    "Edit user": "Editar usuario", 
    "Edition successfully done": "Edici\u00f3n realizada con \u00e9xito", 
    "Empty": "Vac\u00edo", 
    "Ending": "Final", 
    "Enter Maintenance Mode?": "\u00bfEntrar en modo mantenimiento?", 
    "Enter maintenance Mode": "Entrar en modo mantenimiento", 
    "Error accessing data": "Error de acceso a datos", 
    "Error accessing service: ": "Error al acceder al servicio: ", 
    "Error creating report": "Error al crear el informe", 
    "Error creating rule": "Error creando regla", 
    "Error deleting": "Error borrando", 
    "Error obtaining report description": "Error al obtener la descripci\u00f3n del informe", 
    "Error saving rule": "Error al guardar la regla", 
    "Execute action": "Ejecutar acci\u00f3n", 
    "Exit Maintenance Mode": "Salir del modo mantenimiento", 
    "Exit Maintenance Mode?": "Salir del modo mantenimiento", 
    "Failed creating publication": "No se pudo crear la publicaci\u00f3n", 
    "February": "Febrero", 
    "Filter": "Filtro", 
    "Force Cancel": "Forzar cancelaci\u00f3n", 
    "Friday": "Viernes", 
    "Generate report": "Generar informe", 
    "Group": "Grupo", 
    "Group deletion error": "Error al borrar grupo", 
    "Group information": "Informaci\u00f3n del grupo", 
    "Group saved": "Grupo guardado", 
    "Group saving error": "Error al guardar grupo", 
    "Groups found": "Grupos encontrados", 
    "Hours": "Horas", 
    "If selected, will initiate the publication inmediatly after creation": "Si se selecciona, se iniciar\u00e1 la publicaci\u00f3n inmediatamente despu\u00e9s de la creaci\u00f3n", 
    "Image deletion error": "Error al borrar la imagen", 
    "Image is too big (max. upload size is 256Kb)": "La imagen es demasiado grande (el tama\u00f1o m\u00e1ximo es de 256Kb)", 
    "In Maintenance": "En mantenimiento", 
    "Information": "Informaci\u00f3n", 
    "January": "Enero", 
    "July": "Julio", 
    "June": "Junio", 
    "Just a moment...": "Un momento...", 
    "Launch Now": "Lanzar ahora", 
    "Launch action execution right now?": "\u00bfIniciar la ejecuci\u00f3n de la acci\u00f3n ahora?", 
    "Logs": "Logs", 
    "Main": "Principal", 
    "Maintenance": "Mantenimiento", 
    "Maintenance Mode": "Modo de mantenimiento", 
    "March": "Marzo", 
    "May": "Mayo", 
    "Message": "Mensaje", 
    "Minutes": "Minutos", 
    "Monday": "Lunes", 
    "Monthly": "Mensual", 
    "Network creation error": "Error al crear red", 
    "Network deletion error": "Error al eliminar red", 
    "Network saving error": "Error al guardar red", 
    "Never": "Nunca", 
    "New": "Nuevo", 
    "New OSManager": "Nuevo OS Manager", 
    "New Services Pool Group": "Nuevo grupo para Services Pool", 
    "New authenticator": "Nuevo autenticador", 
    "New calendar": "Nuevo calendario", 
    "New group": "Nuevo grupo", 
    "New image": "Nueva imagen", 
    "New meta group": "Nuevo meta grupo", 
    "New network": "Nueva red", 
    "New rule": "Nueva regla", 
    "New service": "Nuevo servicio", 
    "New service pool": "Nuevo Pool de Servicios", 
    "New services provider": "Nuevo proveedor de servicios", 
    "New transport": "Nuevo transporte", 
    "New user": "Nuevo usuario", 
    "No": "No", 
    "No changes has been made": "No se han hecho cambios", 
    "No records": "No hay registros", 
    "November": "Noviembre", 
    "OSManager creation error": "Error al crear OS Manager", 
    "OSManager deletion error": "Error al eliminarl OS Manager", 
    "OSManager saving error": "Error al guardar OS Manager", 
    "October": "Octubre", 
    "Overview": "Visi\u00f3n de conjunto", 
    "Permissions": "Permisos", 
    "Permissions for": "Permisos para", 
    "Please enter a valid URL.": "Por favor, introduzca una URL v\u00e1lida.", 
    "Please enter a valid credit card number.": "Por favor, introduzca un n\u00famero de tarjeta de cr\u00e9dito v\u00e1lida.", 
    "Please enter a valid date (ISO).": "Por favor, introduzca una fecha v\u00e1lida (ISO).", 
    "Please enter a valid date.": "Por favor, introduzca una fecha v\u00e1lida.", 
    "Please enter a valid email address.": "Por favor, introduzca una direcci\u00f3n de correo electr\u00f3nico v\u00e1lida.", 
    "Please enter a valid number.": "Por favor, introduzca un n\u00famero v\u00e1lido.", 
    "Please enter a value between {0} and {1} characters long.": "Por favor, introduzca un valor de entre {0} y {1} caracteres.", 
    "Please enter a value between {0} and {1}.": "Por favor, introduzca un valor entre {0} y {1}.", 
    "Please enter a value greater than or equal to {0}.": "Por favor, introduzca un valor mayor o igual a {0}.", 
    "Please enter a value less than or equal to {0}.": "Por favor, introduzca un valor menor o igual a {0}.", 
    "Please enter at least {0} characters.": "Por favor, introduzca al menos {0} caracteres.", 
    "Please enter no more than {0} characters.": "Por favor, no introduzca m\u00e1s de {0} caracteres.", 
    "Please enter only digits.": "Por favor, introduzca s\u00f3lo cifras.", 
    "Please enter the same value again.": "Por favor, introduzca el mismo valor otra vez.", 
    "Please fix this field.": "Por favor corrija este campo.", 
    "Please wait, processing": "Por favor espere, procesando", 
    "Publish": "Publicar", 
    "Publish on creation": "Publicar en la creaci\u00f3n", 
    "Records _START_ to _END_ of _TOTAL_": "Registros de _START_ a _END_ de _TOTAL_", 
    "Refresh operation failed": "Error en la operaci\u00f3n de actualizaci\u00f3n", 
    "Remove ": "Quitar ", 
    "Remove Assigned service": "Quitar servicio asignado", 
    "Remove Cache element": "Retirar elemento de la cach\u00e9", 
    "Remove access calendar": "Eliminar calendario de acceso", 
    "Remove transport": "Quitar transporte", 
    "Restrained": "Contenido", 
    "Revoke": "Revocar", 
    "Rule deletion error": "Error al eliminar la regla", 
    "Saturday": "S\u00e1bado", 
    "Save": "Guardar", 
    "Search error": "Error en la b\u00fasqueda", 
    "Search groups": "Buscar grupos", 
    "Search users": "Buscar usuarios", 
    "Selected %d rows": "%d filas seleccionadas", 
    "Selected one row": "Seleccionar una fila", 
    "September": "Septiembre", 
    "Service creation error": "Error al crear servicio", 
    "Service deletion error": "Error al eliminar servicio", 
    "Service information": "Informaci\u00f3n sobre el servicio", 
    "Service saving error": "Error al guardar servicio", 
    "Services Pool Group creation error": "Error de creaci\u00f3n de grupo de servicios piscina", 
    "Services Pool Group removal error": "Error de eliminaci\u00f3n de grupo para Services Pool", 
    "Services Pool Group saving error": "Error al guardar grupo para Services Pool", 
    "Services Provider deletion error": "Error al eliminar el proveedor de servicios", 
    "Services Provider saving error": "Error al guardar proveedor de servicios", 
    "Services provider creation error": "Error en la creaci\u00f3n del proveedor de servicios", 
    "Staff member": "Miembro del personal", 
    "Successfully deleted": "Eliminado correctamente", 
    "Sun": "Dom", 
    "Sunday": "Domingo", 
    "Test": "Prueba", 
    "Test failed:": "El test ha fallado:", 
    "Test passed successfully": "Test superado con \u00e9xito", 
    "This field is required.": "Este campo es obligatorio", 
    "This rule will be valid every ": "Esta regla ser\u00e1 v\u00e1lida cada ", 
    "Thursday": "Jueves", 
    "Transport creation error": "Error al crear transporte", 
    "Transport deletion error": "Error al eliminar transporte", 
    "Transport removal error": "Error al quitar transporte", 
    "Transport saving error": "Error al guardar transporte", 
    "Tuesday": "Martes", 
    "Upload": "Subir", 
    "User": "Usuario", 
    "User deletion error": "Error al borrar usuario", 
    "User information": "Informaci\u00f3n de usuario", 
    "User saved": "Usuario guardado", 
    "User saving error": "Error al guardar usuario", 
    "User service deletion error": "Error en la eliminaci\u00f3n del servicio de usuario", 
    "Users found": "Usuarios encontrados", 
    "Wednesday": "Mi\u00e9rcoles", 
    "Weekdays": "D\u00edas de la semana", 
    "Weekly": "Semanal", 
    "Weeks": "Semanas", 
    "Xls": "Xls", 
    "Yearly": "Anual", 
    "Yes": "S\u00ed", 
    "You must provide a transport": "Debe proporcionar un transporte", 
    "You must provide authenticator and": "Usted debe proporcionar autenticador y", 
    "You must provide authenticator and group": "Debe proporcionar autenticador y grupo", 
    "You must select an image": "Debe seleccionar una imagen", 
    "_MENU_ records per page": "_MENU_ Registros por p\u00e1gina", 
    "and will remain valid for": "y seguir\u00e1 siendo v\u00e1lida durante", 
    "creation error": "error de creaci\u00f3n", 
    "day": "d\u00eda", 
    "days": "d\u00edas", 
    "deletion error": "error al eliminar", 
    "error": "error", 
    "from": "Desde el", 
    "items:": "elementos:", 
    "level": "nivel", 
    "message": "Mensaje", 
    "month": "mes", 
    "months": "meses", 
    "no": "no", 
    "of any week": "de cualquier semana", 
    "of type": "de tipo", 
    "onwards": "en adelante", 
    "saving error": "error al guardar", 
    "source": "fuente", 
    "starting at": "comenzando a las", 
    "until ": "hasta ", 
    "week": "semana", 
    "weeks": "semanas", 
    "with no duration": "sin duraci\u00f3n", 
    "year": "a\u00f1o", 
    "years": "a\u00f1os", 
    "yes": "s\u00ed"
  };
  for (var key in newcatalog) {
    django.catalog[key] = newcatalog[key];
  }
  

  if (!django.jsi18n_initialized) {
    django.gettext = function(msgid) {
      var value = django.catalog[msgid];
      if (typeof(value) == 'undefined') {
        return msgid;
      } else {
        return (typeof(value) == 'string') ? value : value[0];
      }
    };

    django.ngettext = function(singular, plural, count) {
      var value = django.catalog[singular];
      if (typeof(value) == 'undefined') {
        return (count == 1) ? singular : plural;
      } else {
        return value[django.pluralidx(count)];
      }
    };

    django.gettext_noop = function(msgid) { return msgid; };

    django.pgettext = function(context, msgid) {
      var value = django.gettext(context + '\x04' + msgid);
      if (value.indexOf('\x04') != -1) {
        value = msgid;
      }
      return value;
    };

    django.npgettext = function(context, singular, plural, count) {
      var value = django.ngettext(context + '\x04' + singular, context + '\x04' + plural, count);
      if (value.indexOf('\x04') != -1) {
        value = django.ngettext(singular, plural, count);
      }
      return value;
    };

    django.interpolate = function(fmt, obj, named) {
      if (named) {
        return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)])});
      } else {
        return fmt.replace(/%s/g, function(match){return String(obj.shift())});
      }
    };


    /* formatting library */

    django.formats = {
    "DATETIME_FORMAT": "N j, Y, P", 
    "DATETIME_INPUT_FORMATS": [
      "%Y-%m-%d %H:%M:%S", 
      "%Y-%m-%d %H:%M:%S.%f", 
      "%Y-%m-%d %H:%M", 
      "%Y-%m-%d", 
      "%m/%d/%Y %H:%M:%S", 
      "%m/%d/%Y %H:%M:%S.%f", 
      "%m/%d/%Y %H:%M", 
      "%m/%d/%Y", 
      "%m/%d/%y %H:%M:%S", 
      "%m/%d/%y %H:%M:%S.%f", 
      "%m/%d/%y %H:%M", 
      "%m/%d/%y"
    ], 
    "DATE_FORMAT": "N j, Y", 
    "DATE_INPUT_FORMATS": [
      "%Y-%m-%d", 
      "%m/%d/%Y", 
      "%m/%d/%y"
    ], 
    "DECIMAL_SEPARATOR": ".", 
    "FIRST_DAY_OF_WEEK": "0", 
    "MONTH_DAY_FORMAT": "F j", 
    "NUMBER_GROUPING": "3", 
    "SHORT_DATETIME_FORMAT": "m/d/Y P", 
    "SHORT_DATE_FORMAT": "m/d/Y", 
    "THOUSAND_SEPARATOR": ",", 
    "TIME_FORMAT": "P", 
    "TIME_INPUT_FORMATS": [
      "%H:%M:%S", 
      "%H:%M:%S.%f", 
      "%H:%M"
    ], 
    "YEAR_MONTH_FORMAT": "F Y"
  };

    django.get_format = function(format_type) {
      var value = django.formats[format_type];
      if (typeof(value) == 'undefined') {
        return format_type;
      } else {
        return value;
      }
    };

    /* add to global namespace */
    globals.pluralidx = django.pluralidx;
    globals.gettext = django.gettext;
    globals.ngettext = django.ngettext;
    globals.gettext_noop = django.gettext_noop;
    globals.pgettext = django.pgettext;
    globals.npgettext = django.npgettext;
    globals.interpolate = django.interpolate;
    globals.get_format = django.get_format;

    django.jsi18n_initialized = true;
  }

}(this));

