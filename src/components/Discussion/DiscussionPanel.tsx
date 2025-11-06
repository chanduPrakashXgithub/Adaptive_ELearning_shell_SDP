import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Posts from '@/components/Posts/Posts';

interface DiscussionPanelProps {
    onClose: () => void;
}

const DiscussionPanel: React.FC<DiscussionPanelProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-end lg:items-center justify-center p-4">
            <div className="w-full lg:w-3/4 max-h-[90vh] overflow-auto">
                <Card className="shadow-xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Student Community Discussion</CardTitle>
                            <Button variant="ghost" onClick={onClose}>Close</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Join live discussions with fellow learners. Share problems, solutions, and study tips.</p>
                        <Posts />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DiscussionPanel;
