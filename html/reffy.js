window.onload = function () {
  const toggleSubSections = spec =>
    Array.prototype.slice.call(spec.querySelectorAll('h2 ~ section'), 0).forEach(
      section => section.hasAttribute('hidden') ?
        section.removeAttribute('hidden') :
        section.setAttribute('hidden', '')
    );

  // Collapse spec sections by default
  Array.prototype.slice.call(document.querySelectorAll('[data-spec]'), 0).forEach(spec => {
    const title = spec.querySelector('h2');

    // Compute the set of anomaly icons to display
    let flags = [];
    if (spec.hasAttribute('data-ok')) {
      flags.push('<i class="fa fa-check fa-lg ok" ' +
        'title="Spec looks good"></i>');
    }
    if (spec.hasAttribute('data-error')) {
      flags.push('<i class="fa fa-exclamation-triangle fa-lg error" ' +
        'title="Spec could not be parsed"></i>');
    }
    if (spec.hasAttribute('data-noNormativeRefs')) {
      flags.push('<span class="fa-stack" ' +
        'title="No normative references found in the spec">' +
        '<i class="fa fa-list fa-stack-1x"></i>' +
        '<i class="fa fa-ban fa-stack-2x warn"></i>' +
        '</span>');
    }
    if (spec.hasAttribute('data-hasInvalidIdl') ||
        spec.hasAttribute('data-hasObsoleteIdl')) {
      flags.push('<i class="fa fa-bug fa-lg error" ' +
        'title="Invalid or obsolete IDL content found"></i>');
    }
    if (spec.hasAttribute('data-unknownIdlNames') ||
        spec.hasAttribute('data-redefinedIdlNames')) {
      flags.push('<i class="fa fa-code fa-lg warn" ' +
        'title="Spec uses unknown IDL terms or re-defines terms defined elsewhere"></i>');
    }
    if (spec.hasAttribute('data-noRefToWebIDL') ||
        spec.hasAttribute('data-missingWebIdlRef') ||
        spec.hasAttribute('data-missingLinkRef')) {
      flags.push('<i class="fa fa-chain-broken fa-lg error" ' +
        'title="Some references are missing"></i>');
    }
    if (spec.hasAttribute('data-inconsistentRef')) {
      flags.push('<i class="fa fa-link fa-lg warn" ' +
        'title="References exist but used inconsistently"></i>');
    }

    // Update the spec title
    title.innerHTML = '<a aria-expanded="false" aria-haspopup="true" href="#" class="pure-g">' +
      '<div class="pure-u-sm-4-5 pure-u-lg-2-3 pure-u-xl-3-5">' +
      '<i class="fa fa-caret-right"></i> ' +
      '<span>' + title.innerHTML + '</span>' +
      '</div> ' +
      '<div class="pure-u-sm-1-5 pure-u-lg-1-3 pure-u-xl-2-5">' +
      flags.join(' ') +
      '</div></a>';

    // Collapse the section by default
    toggleSubSections(spec);

    // Expand/Collapse the section on click
    const link = spec.querySelector('h2 a');
    link.onclick = () => {
      toggleSubSections(spec);
      const caret = title.querySelector('i');
      if (link.getAttribute('aria-expanded') === 'false') {
        link.setAttribute('aria-expanded', 'true');
        caret.setAttribute('class', 'fa fa-caret-down');
        window.history.pushState({}, '', '#' + spec.getAttribute('id'));
      }
      else {
        link.setAttribute('aria-expanded', 'false');
        caret.setAttribute('class', 'fa fa-caret-right');
      }
      return false;
    };
  });

  // Force browser to re-scroll to requested position
  if (document.location.hash) {
    const spec = document.getElementById(document.location.hash.substring(1));
    spec.querySelector('h2 a').click();
    setTimeout(() => spec.scrollIntoView(), 0);
  }
};