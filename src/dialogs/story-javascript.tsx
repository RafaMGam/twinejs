import classNames from 'classnames';
import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {IndentButtons, UndoRedoButtons} from '../components/codemirror';
import {ButtonBar} from '../components/container/button-bar';
import {DialogCard, DialogEditor} from '../components/container/dialog-card';
import {CodeArea} from '../components/control/code-area';
import {usePrefsContext} from '../store/prefs';
import {storyWithId, updateStory, useStoriesContext} from '../store/stories';
import {DialogComponentProps} from './dialogs.types';
import './story-javascript.css';

export interface StoryJavaScriptDialogProps extends DialogComponentProps {
	storyId: string;
}

export const StoryJavaScriptDialog: React.FC<StoryJavaScriptDialogProps> = props => {
	const {storyId, ...other} = props;
	const [cmEditor, setCmEditor] = React.useState<CodeMirror.Editor>();
	const {dispatch, stories} = useStoriesContext();
	const {prefs} = usePrefsContext();
	const story = storyWithId(stories, storyId);
	const {t} = useTranslation();

	const className = classNames('story-javascript-dialog', {
		collapsed: other.collapsed
	});
	const handleChange = (
		editor: CodeMirror.Editor,
		data: CodeMirror.EditorChange,
		text: string
	) => {
		setCmEditor(editor);
		dispatch(updateStory(stories, story, {script: text}));
	};

	return (
		<div className={className}>
			<DialogCard {...other} headerLabel={t('storyJavaScript.title')}>
				<p>{t('storyJavaScript.explanation')}</p>
				<ButtonBar>
					<UndoRedoButtons editor={cmEditor} watch={story.script} />
					<IndentButtons editor={cmEditor} />
				</ButtonBar>
				<DialogEditor>
					<CodeArea
						editorDidMount={setCmEditor}
						fontFamily={prefs.javascriptEditorFontFamily}
						fontScale={prefs.javascriptEditorFontScale}
						onBeforeChange={handleChange}
						options={{autofocus: true, mode: 'javascript'}}
						value={story.script}
					/>
				</DialogEditor>
			</DialogCard>
		</div>
	);
};