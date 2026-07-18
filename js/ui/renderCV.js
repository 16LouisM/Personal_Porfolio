export function renderCVButton() {

    const cvButton = document.getElementById(
        "view-cv"
    );


    if (!cvButton) {
        console.error(
            "CV button not found"
        );
        return;
    }


    const cvPath =
        "assets/folders/Curriculum_vitae_of_NL_Mashele.pdf";


    cvButton.textContent = "View CV";


    cvButton.addEventListener(
        "click",
        () => {

            const link =
                document.createElement("a");


            link.href = cvPath;

            link.download =
                "Nkgere_Louis_Mashele_CV.pdf";


            document.body.appendChild(link);

            link.click();

            link.remove();

        }
    );

}